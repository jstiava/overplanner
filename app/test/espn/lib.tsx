export const getLeagueCode = (league: string): string => {
    switch (league) {
        case 'MLB':
            return 'baseball/mlb'
        case 'NBA':
            return 'basketball/nba'
        case 'WNBA':
            return 'basketball/wnba'
        case 'NFL':
            return 'football/nfl'
        case 'NHL':
            return 'hockey/nhl'
        case 'NCAAF':
            return 'football/college-football'
        case 'NCAAB':
            return 'basketball/mens-college-basketball'
        case 'MLS':
            return 'soccer/usa.1'
        case 'FIFA':
            return 'soccer/fifa.world'
        case 'UEFA':
            return 'soccer/uefa.euro'
        case 'CHAMPIONS':
            return 'soccer/uefa.champions'
        default:
            throw Error(`League (${String(league)}) not supported`)
    }
}


function normalizeTeam(name: string): string {
    return name.trim();
}

function getAbbr(team: string): string {
    const normalized = normalizeTeam(team);
    return teamNameToAbbr[normalized] ?? "UNK";
}

export function formatGameLabel(input: string): string {
    // "St. Louis Cardinals at Chicago Cubs"
    const [awayRaw, homeRaw] = input.split(" at ");

    const awayTeam = normalizeTeam(awayRaw);
    const homeTeam = normalizeTeam(homeRaw);

    const awayAbbr = getAbbr(awayTeam);
    const homeAbbr = getAbbr(homeTeam);

    return `${awayAbbr} icon logo, ${awayAbbr} at ${homeAbbr} Logo ${homeAbbr}`;
}

export function parseGame(input: string) {
    const [awayRaw, homeRaw] = input.split(" at ");

    return {
        away: {
            name: awayRaw.trim(),
            abbr: getAbbr(awayRaw),
            isHome: false
        },
        home: {
            name: homeRaw.trim(),
            abbr: getAbbr(homeRaw),
            isHome: true
        },
    };
}

export function TeamLogo({ abbr }: {
    abbr: string;
}) {
    return (
        <img
            src={`/icons/mlb/${abbr}.png`}
            alt={`${abbr} logo`}
            className="w-5 h-5 inline-block"
        />
    );
}

export function GameLabel({ input }: { input: string }) {
    const { away, home } = parseGame(input);

    return (
        <div className="flex items-center gap-1 leading-none pt-1">
            <TeamLogo abbr={away.abbr} />
            <span>
                {away.abbr} at
            </span>
            <TeamLogo abbr={home.abbr} />
            <span>{home.abbr}</span>
        </div>
    );
}


export const teamNameToAbbr: Record<string, string> = {
    // MLB
    "Arizona Diamondbacks": "ARI",
    "Atlanta Braves": "ATL",
    "Baltimore Orioles": "BAL",
    "Boston Red Sox": "BOS",
    "Chicago Cubs": "CHC",
    "Chicago White Sox": "CHW",
    "Cincinnati Reds": "CIN",
    "Cleveland Guardians": "CLE",
    "Colorado Rockies": "COL",
    "Detroit Tigers": "DET",
    "Houston Astros": "HOU",
    "Kansas City Royals": "KC",
    "Los Angeles Angels": "LAA",
    "Los Angeles Dodgers": "LAD",
    "Miami Marlins": "MIA",
    "Milwaukee Brewers": "MIL",
    "Minnesota Twins": "MIN",
    "New York Mets": "NYM",
    "New York Yankees": "NYY",
    "Athletics Athletics": "ATH",
    "Philadelphia Phillies": "PHI",
    "Pittsburgh Pirates": "PIT",
    "San Diego Padres": "SD",
    "San Francisco Giants": "SF",
    "Seattle Mariners": "SEA",
    "St. Louis Cardinals": "STL",
    "Tampa Bay Rays": "TB",
    "Texas Rangers": "TEX",
    "Toronto Blue Jays": "TOR",
    "Washington Nationals": "WSH",

    // NFL
    "Arizona Cardinals": "ARI",
    "Atlanta Falcons": "ATL",
    "Baltimore Ravens": "BAL",
    "Buffalo Bills": "BUF",
    "Carolina Panthers": "CAR",
    "Chicago Bears": "CHI",
    "Cincinnati Bengals": "CIN",
    "Cleveland Browns": "CLE",
    "Dallas Cowboys": "DAL",
    "Denver Broncos": "DEN",
    "Detroit Lions": "DET",
    "Green Bay Packers": "GB",
    "Houston Texans": "HOU",
    "Indianapolis Colts": "IND",
    "Jacksonville Jaguars": "JAX",
    "Kansas City Chiefs": "KC",
    "Las Vegas Raiders": "LV",
    "Los Angeles Chargers": "LAC",
    "Los Angeles Rams": "LAR",
    "Miami Dolphins": "MIA",
    "Minnesota Vikings": "MIN",
    "New England Patriots": "NE",
    "New Orleans Saints": "NO",
    "New York Giants": "NYG",
    "New York Jets": "NYJ",
    "Philadelphia Eagles": "PHI",
    "Pittsburgh Steelers": "PIT",
    "San Francisco 49ers": "SF",
    "Seattle Seahawks": "SEA",
    "Tampa Bay Buccaneers": "TB",
    "Tennessee Titans": "TEN",
    "Washington Commanders": "WSH",

    // NBA
    "Atlanta Hawks": "ATL",
    "Boston Celtics": "BOS",
    "Brooklyn Nets": "BKN",
    "Charlotte Hornets": "CHA",
    "Chicago Bulls": "CHI",
    "Cleveland Cavaliers": "CLE",
    "Dallas Mavericks": "DAL",
    "Denver Nuggets": "DEN",
    "Detroit Pistons": "DET",
    "Golden State Warriors": "GS",
    "Houston Rockets": "HOU",
    "Indiana Pacers": "IND",
    "LA Clippers": "LAC",
    "Los Angeles Clippers": "LAC",
    "Los Angeles Lakers": "LAL",
    "Memphis Grizzlies": "MEM",
    "Miami Heat": "MIA",
    "Milwaukee Bucks": "MIL",
    "Minnesota Timberwolves": "MIN",
    "New Orleans Pelicans": "NO",
    "New York Knicks": "NY",
    "Oklahoma City Thunder": "OKC",
    "Orlando Magic": "ORL",
    "Philadelphia 76ers": "PHI",
    "Phoenix Suns": "PHX",
    "Portland Trail Blazers": "POR",
    "Sacramento Kings": "SAC",
    "San Antonio Spurs": "SA",
    "Toronto Raptors": "TOR",
    "Utah Jazz": "UTA",
    "Washington Wizards": "WSH",

    // NHL
    "Anaheim Ducks": "ANA",
    "Boston Bruins": "BOS",
    "Buffalo Sabres": "BUF",
    "Calgary Flames": "CGY",
    "Carolina Hurricanes": "CAR",
    "Chicago Blackhawks": "CHI",
    "Colorado Avalanche": "COL",
    "Columbus Blue Jackets": "CBJ",
    "Dallas Stars": "DAL",
    "Detroit Red Wings": "DET",
    "Edmonton Oilers": "EDM",
    "Florida Panthers": "FLA",
    "Los Angeles Kings": "LA",
    "Minnesota Wild": "MIN",
    "Montréal Canadiens": "MTL",
    "Montreal Canadiens": "MTL",
    "Nashville Predators": "NSH",
    "New Jersey Devils": "NJ",
    "New York Islanders": "NYI",
    "New York Rangers": "NYR",
    "Ottawa Senators": "OTT",
    "Philadelphia Flyers": "PHI",
    "Pittsburgh Penguins": "PIT",
    "San Jose Sharks": "SJ",
    "Seattle Kraken": "SEA",
    "St. Louis Blues": "STL",
    "Tampa Bay Lightning": "TB",
    "Toronto Maple Leafs": "TOR",
    "Utah Mammoth": "UTA",
    "Vancouver Canucks": "VAN",
    "Vegas Golden Knights": "VGK",
    "Washington Capitals": "WSH",
    "Winnipeg Jets": "WPG",

    // WNBA
    "Atlanta Dream": "ATL",
    "Chicago Sky": "CHI",
    "Connecticut Sun": "CON",
    "Dallas Wings": "DAL",
    "Golden State Valkyries": "GSV",
    "Indiana Fever": "IND",
    "Las Vegas Aces": "LV",
    "Los Angeles Sparks": "LA",
    "Minnesota Lynx": "MIN",
    "New York Liberty": "NY",
    "Phoenix Mercury": "PHX",
    "Seattle Storm": "SEA",
    "Washington Mystics": "WSH",
};



export interface ESPNEvent {
    id: string;
    date: string;
    name: string;
    shortName: string;
    season: {
        year: number;
        displayName: string
    };
    seasonType: {
        id: string,
        type: number,
        name: string,
        abbreviation: string
    },
    week: {
        number: number,
        test: string
    },
    timeValid: boolean,
    competitions: ESPNCompetition[];
}


export interface ESPNCompetition {
    id: string;
    date: string;
    attendance: number;
    type: {
        id: string,
        text: string,
        abbreviation: string,
        slug: string,
        type: string
    },
    timeValid: boolean,
    neutralSite: boolean;
    boxscoreAvailable: boolean;
    ticketsAvaliable: boolean;
    venue: {
        fullName: string,
        address: {
            city: string,
            state: string,
            zipCode: string
        }
    },
    competitors: ESPNCompetitor[];
    notes: any[],
    broadcasts: {
        type: {
            id: string,
            shortName: string
        },
        market: {
            id: string,
            type: string
        },
        media: {
            shortName: string
        },
        lang: string,
        region: string,
        partnered: boolean
    }[],
    tickets?: {
        id: string,
        summary: string | "Tickets as low as $14",
        description: string,
        maxPrice: number,
        startingPrice: number,
        numberAvaliable: number,
        totalPostings: number,
        links: {
            rel: string[],
            href: string,
            text: string
        }[],
    }[]
    status: {
        clock: number,
        displayClock: string,
        period: string,
        type: {
            id: string,
            name: "STATUS_FINAL" | "STATUS_SCHEDULED" | "STATUS_POSTPONED",
            state: string,
            completed: boolean,
            description: string,
            detail: string,
            shortDetail: string
        },
        halfInning: number,
        periodPrefix: "Top" | "Bottom",
        featuredAthletes: ESPNAthlete[]
    },
    links: {
        language: string,
        rel: string[],
        href: string,
        text: string,
        shortText: string,
        isExternal: string,
        isPremium: string
    }
}



export interface ESPNCompetitor {
    id: string;
    type: string;
    order: number;
    homeAway: "home" | "away";
    winner: boolean;
    team: {
        id: string,
        location: string,
        abbreviation: string,
        displayName: string,
        shortDisplayName: string,
        logos: {
            href: string,
            width: number,
            height: number,
            alt: string,
            rel: string[],
            lastUpdated: string
        }[],
        links: {
            rel: string[],
            href: string,
            text: string
        }[],
        score: {
            value: number,
            displayValue: string
        },
        record: {
            id: string,
            abbreviation: string,
            displayName: string,
            shortDisplayName: string,
            description: string,
            type: string,
            displayValue: string
        }[]
    },
    probables: ESPNAthlete[]

}

export interface ESPNAthlete {
    name: string,
    displayName: string,
    shortDisplayName: string,
    abbreviation: string,
    playerId: number,
    athlete: {
        id: string,
        lastName: string,
        displayName: string,
        shortName: string,
        links: any[],
        record: string,
        saves: string
    },
    team: {
        id: string,
        name: string
    }
}