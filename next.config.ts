import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Cloud Run 등 컨테이너 배포 시 .next/standalone으로 최소 실행 이미지를 만들기 위해 필요 */
  output: "standalone",
};

export default nextConfig;
