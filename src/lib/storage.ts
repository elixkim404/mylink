import { MyLinkData } from "../types/mylink";

export const STORAGE_KEY = "mylink_data";

export const DEFAULT_MYLINK_DATA: MyLinkData = {
  profile: {
    handle: "junseop_dev",
    display_name: "김예현",
    badge: "🎓 컴공과 26학번",
    bio: "배운 것을 기록하고 만드는 걸 좋아하는 새내기 👩‍💻\n토스 디자인 시스템(TDS)으로 만든 마이링크",
    avatar_url: "/images/avatar.svg",
    socials: {
      github: "https://github.com/elixkim404",
      email: "mailto:294705559+elixkim404@users.noreply.github.com",
      instagram: "https://instagram.com",
    },
  },
  links: [
    {
      id: "link-1",
      title: "MyLink — 포트폴리오 웹 서비스",
      subtitle: "TDS 디자인 토큰 기반 반응형 웹 프로젝트",
      url: "https://github.com/elixkim404/mylink",
      icon: "💻",
      badge: "Featured",
      is_active: true,
      sort_order: 1,
      click_count: 243,
    },
    {
      id: "link-2",
      title: "새내기 개발 & 공부 일지",
      subtitle: "C언어, 파이썬, CS 기초 수업과 스터디 기록",
      url: "https://github.com/elixkim404",
      icon: "📚",
      badge: "Study",
      is_active: true,
      sort_order: 2,
      click_count: 128,
    },
    {
      id: "link-3",
      title: "커피챗 & 선배님 조언 신청",
      subtitle: "궁금한 점이나 프로젝트 이야기 언제든 환영해요!",
      url: "mailto:294705559+elixkim404@users.noreply.github.com",
      icon: "☕",
      badge: "Coffee Chat",
      is_active: true,
      sort_order: 3,
      click_count: 57,
    },
    {
      id: "link-4",
      title: "컴공과 1학년 알고리즘 문제풀이 노트",
      subtitle: "백준·프로그래머스 실버 단계 풀이 모음",
      url: "https://github.com/elixkim404",
      icon: "📝",
      badge: "Repo",
      is_active: true,
      sort_order: 4,
      click_count: 82,
    },
    {
      id: "link-5",
      title: "비활성화된 임시 링크 (비노출 예시)",
      subtitle: "소유자가 비활성화하여 방문자 화면에는 보이지 않는 링크",
      url: "https://example.com",
      icon: "🔒",
      is_active: false,
      sort_order: 5,
      click_count: 14,
    },
  ],
  cheer_count: 168,
  cheers: [
    {
      id: "cheer-1",
      author: "컴공과 선배",
      content: "1학년 때부터 이렇게 웹 만드는 거 대단해요! 🍀",
      time: "20분 전",
    },
    {
      id: "cheer-2",
      author: "새내기 동기",
      content: "캐릭터 너무 귀엽고 마이링크 깔끔하다! 스터디 화이팅 ☕",
      time: "1시간 전",
    },
  ],
};

export function getStoredMyLinkData(): MyLinkData {
  if (typeof window === "undefined") {
    return DEFAULT_MYLINK_DATA;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MYLINK_DATA));
      return DEFAULT_MYLINK_DATA;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_MYLINK_DATA,
      ...parsed,
      profile: {
        ...DEFAULT_MYLINK_DATA.profile,
        ...(parsed.profile || {}),
        socials: {
          ...DEFAULT_MYLINK_DATA.profile.socials,
          ...(parsed.profile?.socials || {}),
        },
      },
      links: Array.isArray(parsed.links) ? parsed.links : DEFAULT_MYLINK_DATA.links,
      cheers: Array.isArray(parsed.cheers) ? parsed.cheers : DEFAULT_MYLINK_DATA.cheers,
    };
  } catch (err) {
    console.error("Failed to read mylink_data from localStorage:", err);
    return DEFAULT_MYLINK_DATA;
  }
}

export function saveStoredMyLinkData(data: MyLinkData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save mylink_data to localStorage:", err);
  }
}

export function incrementLinkClick(linkId: string): void {
  if (typeof window === "undefined") return;
  try {
    const data = getStoredMyLinkData();
    const updatedLinks = data.links.map((link) => {
      if (link.id === linkId) {
        return {
          ...link,
          click_count: (link.click_count || 0) + 1,
        };
      }
      return link;
    });
    const updatedData = { ...data, links: updatedLinks };
    saveStoredMyLinkData(updatedData);
  } catch (err) {
    console.error("Failed to record link click:", err);
  }
}
