import type { Post } from "@/lib/post";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function getPopularPosts(
  posts: readonly Post[],
  hostname: string,
): Promise<Post[]> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const accessToken = process.env.GA4_ACCESS_TOKEN;

  // Local development and CI build without access to Analytics.
  if (propertyId === undefined && accessToken === undefined) return [];
  if (!propertyId || !/^\d+$/.test(propertyId) || !accessToken?.trim()) {
    throw new Error("GA4_PROPERTY_IDとGA4_ACCESS_TOKENを設定してください。");
  }

  const publishedPosts = posts.filter((post) => !post.draft);
  if (publishedPosts.length === 0) return [];

  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(30_000),
      body: JSON.stringify({
        dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        dimensionFilter: {
          andGroup: {
            expressions: [
              {
                filter: {
                  fieldName: "hostName",
                  stringFilter: {
                    matchType: "EXACT",
                    value: hostname,
                    caseSensitive: true,
                  },
                },
              },
              {
                filter: {
                  fieldName: "pagePath",
                  stringFilter: {
                    matchType: "BEGINS_WITH",
                    value: "/posts/",
                    caseSensitive: true,
                  },
                },
              },
            ],
          },
        },
        limit: "10000",
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`GA4の集計に失敗しました（HTTP ${response.status}）。`);
  }

  const report: unknown = await response.json();
  if (!isRecord(report)) throw new Error("GA4の応答形式が不正です。");
  const rows = report.rows ?? [];
  const rowCount = report.rowCount ?? 0;
  // ponytail: fail on truncation; add pagination if article paths exceed 10,000.
  if (!Array.isArray(rows) || rowCount !== rows.length) {
    throw new Error("GA4の集計結果を全件取得できませんでした。");
  }

  const viewsBySlug = new Map<string, number>();
  for (const row of rows) {
    if (
      !isRecord(row) ||
      !Array.isArray(row.dimensionValues) ||
      !Array.isArray(row.metricValues)
    ) {
      throw new Error("GA4の集計行が不正です。");
    }
    const dimension: unknown = row.dimensionValues[0];
    const metric: unknown = row.metricValues[0];
    if (
      !isRecord(dimension) ||
      typeof dimension.value !== "string" ||
      !isRecord(metric) ||
      typeof metric.value !== "string" ||
      !/^\d+$/.test(metric.value) ||
      !Number.isSafeInteger(Number(metric.value))
    ) {
      throw new Error("GA4の記事URLまたは閲覧数が不正です。");
    }

    const slug = /^\/posts\/([^/]+)\/?$/.exec(dimension.value)?.[1];
    if (!slug) continue;
    const views = (viewsBySlug.get(slug) ?? 0) + Number(metric.value);
    if (!Number.isSafeInteger(views)) {
      throw new Error("GA4の閲覧数が集計可能な範囲を超えています。");
    }
    viewsBySlug.set(slug, views);
  }

  const popularPosts = publishedPosts
    .filter((post) => (viewsBySlug.get(post.slug) ?? 0) > 0)
    .sort(
      (left, right) =>
        (viewsBySlug.get(right.slug) ?? 0) -
          (viewsBySlug.get(left.slug) ?? 0) ||
        left.slug.localeCompare(right.slug, "en"),
    )
    .slice(0, 5);
  if (popularPosts.length === 0) {
    throw new Error("公開記事のGA4閲覧データがありません。配信を停止します。");
  }
  return popularPosts;
}
