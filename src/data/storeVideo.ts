/**
 * Content for 直播与视频 (/store/video), captured from
 * wegame.com.cn/store/game_video.html. Thumbnails are in /public/wegame/store/video.
 *
 * Videos are stored once and referenced by id from each section
 * (featuredIds, newsIds, weeklyIds), because the live site shows the same
 * video in several places. One source of truth, no copies to drift apart.
 */

const v = (file: string) => `/wegame/store/video/${file}`;

/** The game a video or stream belongs to (the chip under each card). */
export interface VideoGame {
  name: string;
  icon: string;
  tags: string[];
}

export interface VideoItem {
  id: string;
  title: string;
  thumb: string;
  views: number;
  /** "mm:ss" */
  duration: string;
  author: string;
  /** "MM-DD" upload date */
  date: string;
  game: VideoGame;
}

export interface LiveStream {
  id: string;
  title: string;
  thumb: string;
  viewers: number;
  platform: "douyu" | "huya" | "kuaishou" | "bilibili";
  streamer: string;
  game: VideoGame;
}

const game = (name: string, icon: string, tags: string[]): VideoGame => ({
  name,
  icon: v(icon),
  tags,
});

/** Display names for the streaming sites. */
export const platformNames: Record<LiveStream["platform"], string> = {
  douyu: "斗鱼",
  huya: "虎牙",
  kuaishou: "快手",
  bilibili: "哔哩哔哩",
};

export const videos: VideoItem[] = [
  {
    id: "v1",
    title: "《狩》首曝PV丨动作要秀，有狩就行！",
    thumb: v("thumb-01.jpg"),
    views: 7221,
    duration: "01:51",
    author: "狩SHOU",
    date: "11-25",
    game: game("狩", "icon-01.png", ["大逃杀", "动作格斗"]),
  },
  {
    id: "v2",
    title: "异人之下游戏｜正式定档｜关于“纯”，他有发言权！",
    thumb: v("thumb-02.jpg"),
    views: 16000,
    duration: "02:10",
    author: "异人之下游戏",
    date: "11-23",
    game: game("异人之下", "icon-02.png", ["动作RPG", "动作格斗"]),
  },
  {
    id: "v3",
    title: "DNFU·2026年度CG",
    thumb: v("thumb-03.jpg"),
    views: 9790,
    duration: "03:11",
    author: "地下城与勇士",
    date: "11-23",
    game: game("地下城与勇士经典版", "icon-03.png", ["动作RPG", "动作格斗"]),
  },
  {
    id: "v4",
    title: "国服二测上手验货！奇袭者代表探店工作室｜弧光猎人开发日记 第三期",
    thumb: v("thumb-04.jpg"),
    views: 5696,
    duration: "20:02",
    author: "弧光猎人_ARCRaiders",
    date: "11-23",
    game: game("弧光猎人", "icon-04.png", ["TPS", "科幻"]),
  },
  {
    id: "v5",
    title: "《怪物猎人：旅人》WeGame先导片",
    thumb: v("thumb-05.jpg"),
    views: 29000,
    duration: "02:16",
    author: "怪物猎人旅人",
    date: "11-20",
    game: game("怪物猎人：旅人", "icon-05.png", ["动作RPG", "爽快手感"]),
  },
  {
    id: "v6",
    title: "WarFace制作人聊一聊 先遣测试招募中",
    thumb: v("thumb-06.jpg"),
    views: 9761,
    duration: "04:38",
    author: "战争前线突围",
    date: "11-20",
    game: game("战争前线：突围", "icon-06.png", ["FPS", "战术射击"]),
  },
  {
    id: "v7",
    title: "公测定档11月19日 多端互通，全域畅玩 一起开启【新故事 新冒险】",
    thumb: v("thumb-07.jpg"),
    views: 28000,
    duration: "01:04",
    author: "斗罗大陆诛邪传说",
    date: "11-19",
    game: game("斗罗大陆：诛邪传说", "icon-07.png", ["动作RPG", "MMORPG"]),
  },
  {
    id: "v8",
    title: "总有世界，与你同频｜《弧光猎人》同频测试PV",
    thumb: v("thumb-08.jpg"),
    views: 54000,
    duration: "03:54",
    author: "弧光猎人_ARCRaiders",
    date: "11-03",
    game: game("弧光猎人", "icon-04.png", ["TPS", "科幻"]),
  },
  {
    id: "v9",
    title: "诠释中国功夫朋克 | 《影之刃零》正式发售",
    thumb: v("thumb-09.jpg"),
    views: 111000,
    duration: "03:05",
    author: "影之刃零",
    date: "10-29",
    game: game("影之刃零", "icon-08.png", ["动作RPG", "武侠"]),
  },
  {
    id: "v10",
    title: "10月29日新英雄上线丨一念起落 // 遐思英雄预告",
    thumb: v("thumb-10.jpg"),
    views: 50000,
    duration: "02:42",
    author: "无畏契约",
    date: "10-19",
    game: game("无畏契约", "icon-09.png", ["FPS", "战术射击"]),
  },
  {
    id: "v11",
    title: "集结！跃向巅峰殿堂 | NBA公测联动PV公开！",
    thumb: v("thumb-11.jpg"),
    views: 28000,
    duration: "00:29",
    author: "篮球少女飞跃巅峰",
    date: "10-23",
    game: game("篮球少女：飞跃巅峰", "icon-10.png", ["篮球", "卡牌"]),
  },
];
export const featuredIds = ["v1", "v2", "v3", "v4", "v5", "v6"];
export const newsIds = ["v7", "v8", "v9", "v10", "v11"];
export const weeklyIds = ["v7", "v5", "v2", "v1"];
export const liveStreams: LiveStream[] = [
  {
    id: "l1",
    title: "最快搬砖，两天三亿",
    thumb: v("live-01.jpg"),
    viewers: 651,
    platform: "douyu",
    streamer: "爱搬砖的老虎",
    game: game("地下城与勇士：创新世纪", "icon-23.png", ["MMORPG", "动作冒险"]),
  },
  {
    id: "l2",
    title: "宅家全职游戏，新版本教学",
    thumb: v("live-02.jpg"),
    viewers: 537,
    platform: "huya",
    streamer: "AH丶海风教主",
    game: game("地下城与勇士：创新世纪", "icon-23.png", ["MMORPG", "动作冒险"]),
  },
  {
    id: "l3",
    title: "恭喜BLG获得2026英雄联盟全球总决赛冠军！",
    thumb: v("live-03.jpg"),
    viewers: 153,
    platform: "huya",
    streamer: "虎牙英雄联盟赛事",
    game: game("英雄联盟", "icon-24.png", ["MOBA", "电子竞技"]),
  },
  {
    id: "l4",
    title: "来白嫖龙环金秋套13增幅券0元购",
    thumb: v("live-04.jpg"),
    viewers: 149,
    platform: "huya",
    streamer: "AH丶杰哥助您圆梦",
    game: game("地下城与勇士：创新世纪", "icon-23.png", ["MMORPG", "动作冒险"]),
  },
  {
    id: "l5",
    title: "直播PK光环灯管不排队",
    thumb: v("live-05.jpg"),
    viewers: 69,
    platform: "douyu",
    streamer: "全职pk惜别",
    game: game("地下城与勇士：创新世纪", "icon-23.png", ["MMORPG", "动作冒险"]),
  },
  {
    id: "l6",
    title: "最终大逃杀开启！视觉享受！",
    thumb: v("live-06.jpg"),
    viewers: 22,
    platform: "huya",
    streamer: "baicaiovo",
    game: game("英雄联盟", "icon-24.png", ["MOBA", "电子竞技"]),
  },
  {
    id: "l7",
    title: "蜘蛛馍：野区教学每晚12点直播 不见不散",
    thumb: v("live-07.jpg"),
    viewers: 19,
    platform: "douyu",
    streamer: "MQ丶蜘蛛馍",
    game: game("英雄联盟", "icon-24.png", ["MOBA", "电子竞技"]),
  },
  {
    id: "l8",
    title: "恭喜没有预兆夺冠！！",
    thumb: v("live-08.jpg"),
    viewers: 18,
    platform: "huya",
    streamer: "云顶之弈赛事",
    game: game("英雄联盟", "icon-24.png", ["MOBA", "电子竞技"]),
  },
  {
    id: "l9",
    title: "CFS世界赛白鲨加油！",
    thumb: v("live-11.jpg"),
    viewers: 13,
    platform: "douyu",
    streamer: "白鲨AyoM",
    game: game("穿越火线", "icon-25.png", ["FPS", "战术射击"]),
  },
  {
    id: "l10",
    title: "【直播回放】阿特之老人猪播",
    thumb: v("live-09.jpg"),
    viewers: 13,
    platform: "huya",
    streamer: "V1ncent丶文森特",
    game: game("英雄联盟", "icon-24.png", ["MOBA", "电子竞技"]),
  },
  {
    id: "l11",
    title: "全神贯注 峡谷认真上分",
    thumb: v("live-10.jpg"),
    viewers: 12,
    platform: "huya",
    streamer: "霸哥",
    game: game("英雄联盟", "icon-24.png", ["MOBA", "电子竞技"]),
  },
  {
    id: "l12",
    title: "美测八王局训练！！",
    thumb: v("live-13.jpg"),
    viewers: 11,
    platform: "douyu",
    streamer: "阿涛皎月Carry",
    game: game("英雄联盟", "icon-24.png", ["MOBA", "电子竞技"]),
  },
  {
    id: "l13",
    title: "IG-Theshy韩服排位！",
    thumb: v("live-12.jpg"),
    viewers: 9,
    platform: "huya",
    streamer: "阿驴ob",
    game: game("英雄联盟", "icon-24.png", ["MOBA", "电子竞技"]),
  },
  {
    id: "l14",
    title: "余小C：每天都是元气满满的一天！",
    thumb: v("live-14.jpg"),
    viewers: 7,
    platform: "douyu",
    streamer: "余小C真的很强",
    game: game("英雄联盟", "icon-24.png", ["MOBA", "电子竞技"]),
  },
  {
    id: "l15",
    title: "随便打会排位开心一下吧~",
    thumb: v("live-15.jpg"),
    viewers: 6,
    platform: "douyu",
    streamer: "主播油条",
    game: game("英雄联盟", "icon-24.png", ["MOBA", "电子竞技"]),
  },
  {
    id: "l16",
    title: "开心三角洲,快乐摸大红.",
    thumb: v("live-16.jpg"),
    viewers: 7,
    platform: "douyu",
    streamer: "Zy丶腰子",
    game: game("三角洲行动", "icon-27.png", ["FPS", "军事"]),
  },
  {
    id: "l17",
    title: "主播真会玩联盟篇",
    thumb: v("live-17.jpg"),
    viewers: 4,
    platform: "douyu",
    streamer: "主播真会玩节目组丶",
    game: game("英雄联盟", "icon-24.png", ["MOBA", "电子竞技"]),
  },
  {
    id: "l18",
    title: "ATE vs N1K无畏契约解说杯",
    thumb: v("live-18.jpg"),
    viewers: 4,
    platform: "huya",
    streamer: "虎牙无畏契约赛事",
    game: game("无畏契约", "icon-09.png", ["FPS", "战术射击"]),
  },
  {
    id: "l19",
    title: "最后的S18，国服排位~",
    thumb: v("live-19.jpg"),
    viewers: 4,
    platform: "douyu",
    streamer: "仙凡哥哥丶",
    game: game("英雄联盟", "icon-24.png", ["MOBA", "电子竞技"]),
  },
  {
    id: "l20",
    title: "继续练奥拉夫 今晚八点打langx~！",
    thumb: v("live-20.jpg"),
    viewers: 3,
    platform: "huya",
    streamer: "解说米勒",
    game: game("英雄联盟", "icon-24.png", ["MOBA", "电子竞技"]),
  },
];
