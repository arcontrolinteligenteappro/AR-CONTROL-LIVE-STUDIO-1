
import { SportType, ScoreboardState, SportEvent, MatchStatus, BaseballStats } from '../types';

export const formatTime = (minutes: number, seconds: number): string => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const getPeriodLabel = (state: ScoreboardState): string => {
    if (state.sportType === SportType.BASEBALL) {
        return state.baseballStats?.inningTop ? 'Alta' : 'Baja';
    }
    return `Periodo ${state.period}`;
};

export const resetScoreboardForSport = (sport: SportType): ScoreboardState => {
    const base: ScoreboardState = {
        sportType: sport,
        homeName: 'LOCAL',
        awayName: 'VISITA',
        homeScore: 0,
        awayScore: 0,
        timer: '00:00',
        period: 1,
        isVisible: true,
        isTimerRunning: false,
        timerMinutes: 0,
        timerSeconds: 0,
        addedMinutes: 0,
        matchStatus: MatchStatus.PRE_MATCH,
        matchContext: { mode: 'REGULAR' },
        overlaySettings: { position: 'TOP_LEFT', opacity: 1, scale: 1, keepOnScenes: false }
    };

    if (sport === SportType.BASEBALL) {
        base.baseballStats = { balls: 0, strikes: 0, outs: 0, inningTop: true };
    }

    return base;
};

export const swapTeams = (state: ScoreboardState): ScoreboardState => {
    return {
        ...state,
        homeName: state.awayName,
        awayName: state.homeName,
        homeScore: state.awayScore,
        awayScore: state.homeScore,
        homeColor: state.awayColor,
        awayColor: state.homeColor,
        homeLogo: state.awayLogo,
        awayLogo: state.homeLogo,
        homeTeamId: state.awayTeamId,
        awayTeamId: state.homeTeamId
    };
};

export const updateBaseballPlayerStats = (stats: BaseballStats | undefined, action: string): BaseballStats | undefined => {
    if (!stats) return stats;
    // Simple mock logic for stat updates
    return { ...stats };
};

export const processSportRules = (state: ScoreboardState, event: SportEvent): ScoreboardState => {
    // Fix: Explicitly type newState to avoid anonymous type inference issues with scoreboard properties
    const newState: ScoreboardState = { ...state };
    
    if (newState.sportType === SportType.BASEBALL) {
        // MLB Logic
        if (event === SportEvent.STRIKE && newState.baseballStats) {
            newState.baseballStats.strikes++;
            if (newState.baseballStats.strikes >= 3) {
                newState.baseballStats.strikes = 0;
                newState.baseballStats.balls = 0;
                newState.baseballStats.outs++;
            }
        }
    }
    
    if (newState.sportType === SportType.SOCCER) {
        if (event === SportEvent.GOAL) {
            // El orquestador debería disparar Replay aquí
        }
    }

    return newState;
};
