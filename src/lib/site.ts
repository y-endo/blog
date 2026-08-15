export const siteName = "ENDO JOURNAL";
export const siteDescription =
  "Web開発とAIを中心に、個人開発、フロントエンド、AWS、Webデザインの試行錯誤と、ときどき日々のことを記録する個人ブログです。";
export const siteLogoPath = "/brand/endo-journal.svg";
export const siteUrl = new URL("https://blog.endoyuki.jp");
export const openGraphImage = {
  alt: "ENDO JOURNALのロゴとWebデザイン資料を配置したサイトイメージ",
  height: 909,
  url: "/opengraph-image.png",
  width: 1731,
} as const;

export function getAbsoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}
