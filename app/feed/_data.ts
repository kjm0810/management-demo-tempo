export type FeedPost = {
  id: string;
  projectId: string;
  authorId: string;
  authorName: string;
  authorRole: "management" | "streamer";
  text: string;
  createdAt: string;
  likedBy: string[];
};

export type FeedComment = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
};

/** 프로젝트에 참여 중인 사람이면 누구나(스트리머·관리자) 글을 올릴 수 있는 피드. */
export const initialFeedPosts: FeedPost[] = [
  {
    id: "f1",
    projectId: "p1",
    authorId: "1",
    authorName: "스트리머 A",
    authorRole: "streamer",
    text: "오늘 방송 시청해주신 분들 감사합니다! 다음 주에는 특별 콜라보 준비 중이에요 👀",
    createdAt: "09.14 21:32",
    likedBy: ["mgmt", "2"],
  },
  {
    id: "f2",
    projectId: "p1",
    authorId: "mgmt",
    authorName: "매니지먼트사",
    authorRole: "management",
    text: "9월 정규 방송 시청자 지표가 지난달 대비 많이 올랐네요. 다들 고생 많으셨습니다!",
    createdAt: "09.15 10:05",
    likedBy: ["1"],
  },
  {
    id: "f3",
    projectId: "p3",
    authorId: "3",
    authorName: "스트리머 C",
    authorRole: "streamer",
    text: "게임 크루 프로젝트 다음 촬영 장소 후보 정했습니다! 회의 때 공유드릴게요.",
    createdAt: "09.13 18:47",
    likedBy: [],
  },
];

export const initialFeedComments: FeedComment[] = [
  {
    id: "c1",
    postId: "f1",
    authorId: "mgmt",
    authorName: "매니지먼트사",
    text: "콜라보 기대할게요!",
    createdAt: "09.14 21:40",
  },
  {
    id: "c2",
    postId: "f2",
    authorId: "1",
    authorName: "스트리머 A",
    text: "다음 달에도 이어가봐요 :)",
    createdAt: "09.15 10:20",
  },
];
