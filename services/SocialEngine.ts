
import { SocialComment } from '../types';

const MOCK_MESSAGES = [
    "Amazing goal! ⚽",
    "Where is the replay??",
    "Let's go Team A!",
    "Camera 2 is slightly out of focus",
    "Greetings from Brazil 🇧🇷",
    "Can you show the score?",
    "That was clearly offside!",
    "Best stream quality so far."
];

const MOCK_USERS = ["SoccerFan99", "LiveSportsTV", "J_Doe", "UltraFan", "Coach_Mike"];

export const fetchSocialUpdate = (): SocialComment => {
    const platformRoll = Math.random();
    let platform: any = 'YOUTUBE';
    if (platformRoll > 0.7) platform = 'TWITCH';
    else if (platformRoll > 0.9) platform = 'TWITTER';

    return {
        id: `msg-${Date.now()}`,
        platform: platform,
        user: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)],
        message: MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
    };
};
