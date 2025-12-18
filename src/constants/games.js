import TicTacToe from "../Components/Games/TicTacToe/tictactoe";
import SpaceInvaders from '../Components/Games/SpaceInvaders/spaceinvaders';
import Pacman from '../Components/Games/Pacman/pacman';
import SweetCrush from '../Components/Games/SweetCrush/sweetcrush';
import ConnectFourGame from '../Components/Games/ConnectFour/index';
import Birds from "../Components/Games/BirdShooter/birds";
import WackMole from "../Components/Games/WackMole/wackmole";
import Sudoku from "../Components/Games/Sudoku/sudoku";
import Scroll from "../Components/Games/Scroll/scroll";
import Race from "../Components/Games/Race/race";
import ClickLots from "../Components/Games/Frogger/frogger";
import FoodFall from "../Components/Games/FoodFall/foodfall";

const games = [
    {
        name: "Sudoku Master",
        surname: "sudoku",
        price: "9.99",
        desc: 'Sudoku is a logic-based, combinatorial number-placement puzzle. The objective is to fill a 9×9 grid with digits so that each column, each row, and each of the nine 3×3 subgrids that compose the grid contain all of the digits from 1 to 9. The puzzle setter provides a partially completed grid, which for a well-posed puzzle has a single solution. Challenge yourself with different difficulty levels and test your logic and problem-solving skills.',
        link: <Sudoku />,
        release: '15th of June, 2020',
        platforms: 'PC',
        genre: 'Strategy',
        developers: 'Amith Raravi',
        publishers: 'Independent',
        inCart: false,
        selected: false,
        isHovered: false,
        isLiked: false,
        rating: 88,
        id: 0,
        cover: "https://arenacloud.cdn.arkadiumhosted.com/arenaxstorage-blob/arenax-index/_arena-shared-content_/arkcom-game-arts/sudoku/Game_Tiles/webp/280x280_x2.webp",
        footage: [
            "https://i.imgur.com/7YqZQoL.png",
            "https://i.imgur.com/7YqZQoL.png",
            "https://i.imgur.com/7YqZQoL.png",
            "https://i.imgur.com/7YqZQoL.png"
        ]
    },
    {
        name: "Food Fall",
        surname: "foodfall",
        price: "44.99",
        desc: 'Sequel to the acclaimed Portal (2007), Portal 2 pits the protagonist of the original game, Chell, and her new robot friend, Wheatley, against more puzzles conceived by GLaDOS, an A.I. with the sole purpose of testing the Portal Guns mechanics and taking revenge on Chell for the events of Portal. As a result of several interactions and revelations, Chell once again pushes to escape Aperture Science Labs.',
        link: <FoodFall/>,
        release: '19th of April, 2011',
        platforms: 'Linux, Xbox 360, Mac, PC, PlayStation 3',
        genre: 'Puzzle',
        developers: 'Valve',
        publishers: 'Valve',
        inCart: false,
        selected: false,
        isHovered: false,
        isLiked: false,
        rating: 92,
        id: 1,
        cover: "https://res.cloudinary.com/dwkt7zgrd/image/upload/v1765986553/HoseaCodes/Gemini_Generated_Image_6ljpac6ljpac6ljp_rmd7tp.png",
        footage: [
            "https://res.cloudinary.com/gianlucajahn/image/upload/v1658188606/portal2_eugfiq.jpg",
            "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238290/portal2_1_tm6kyw.jpg",
            "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238290/portal2_2_kmrlol.jpg",
            "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238292/portal2_3_pjhzkj.jpg"
        ]
    },
    {
        name: "Frogger",
        surname: "civilization",
        price: "27.99",
        desc: 'Civilization is a turn-based strategy game in which you attempt to build an empire to stand the test of time. Become Ruler of the World by establishing and leading a civilization from the Stone Age to the Information Age. Wage war, conduct diplomacy, advance your culture, and go head-to-head with historys greatest leaders as you attempt to build the greatest civilization the world has ever known.',
        link: <ClickLots/>,
        release: '20th of October, 2016',
        platforms: 'Xbox One, PlayStation 4, Linux, Mac, iOS, PC, Nintendo Switch',
        genre: 'Strategy',
        developers: 'Firaxis Games',
        publishers: '2K Games / Aspyr Media',
        inCart: false,
        selected: false,
        isHovered: false,
        isLiked: false,
        rating: 82,
        id: 2,
        cover: "https://imgs.crazygames.com/games/frogger/cover-1608649658695.png?metadata=none&quality=60&height=3345",
        footage: [
            "https://res.cloudinary.com/gianlucajahn/image/upload/v1658188603/civilization_jcuqap.jpg",
            "https://res.cloudinary.com/gianlucajahn/image/upload/c_scale,q_100,w_1920/v1658238319/civilization_2_gpuqrk.jpg",
            "https://res.cloudinary.com/gianlucajahn/image/upload/c_scale,q_100,w_1920/v1658238319/civilization_1_cc21ew.jpg",
            "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238318/civilization_3_qv8ben.jpg"
        ]
    },
    {
        name: "Snail Race",
        surname: "race",
        price: "41.99",
         desc: 'Many years have passed since Kratos took his vengeance against the Olympian gods. Having survived his final encounter with his father Zeus, Kratos has since travelled to Midgard in Ancient Norway and now lives with his young son Atreus in the world of the Norse gods, a savage land inhabited by many ferocious monsters and warriors. In order to teach his son, whose mother (and Kratoss second wife) has recently died, how to survive in such a world, Kratos must master the rage that has driven him for many years and embrace his newfound role as a father and a mentor.',
        link: <Race/>,
        release: '20th of April, 2018',
        platforms: 'PlayStation 4, PC',
        genre: 'Adventure',
        developers: 'Santa Monica Studio',
        publishers: 'Sony Interactive Entertainment',
        inCart: false,
        selected: false,
        isHovered: false,
        isLiked: false,
        rating: 94,
        id: 3,
        cover: "https://res.cloudinary.com/dwkt7zgrd/image/upload/v1765988700/HoseaCodes/Gemini_Generated_Image_hhfeoyhhfeoyhhfe_avc5pb.png",
        footage: [
            "https://res.cloudinary.com/gianlucajahn/image/upload/v1658188602/godofwar_cbqzk1.jpg",
            "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238374/godofwar_1_c7k5as.jpg",
            "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238373/godofwar_2_tiemyf.jpg",
            "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238377/godofwar_3_qohtw3.jpg"
        ]
    },
    {
        name: "Scroll",
        surname: "fifa",
        price: "15.99",
        desc: 'Powered by Football, FIFA 22 brings the game even closer to the real thing with fundamental gameplay advances and a new season of innovation across every mode. Play with 17,000+ players, over 700 teams in 90+ stadiums and more than 30 leagues from all over the globe.',
        link: <Scroll/>,
        release: '30th of September, 2021',
        platforms: 'Xbox One, PlayStation 4, PlayStation 5, PC, Xbox Series S/X, Google Stadia',
        genre: 'Sports',
        developers: 'EA Vancouver / EA Romania',
        publishers: 'EA Sports',
        inCart: false,
        selected: false,
        isHovered: false,
        isLiked: false,
        rating: 80,
        id: 4,
        cover: "https://res.cloudinary.com/dwkt7zgrd/image/upload/v1766014615/HoseaCodes/Gemini_Generated_Image_27kr1g27kr1g27kr_1_au48fx.png",
        footage: [
            "https://res.cloudinary.com/gianlucajahn/image/upload/v1658188603/fifa_zb6ook.jpg",
            "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238407/fifa_1_tt7wm8.jpg",
            "https://res.cloudinary.com/gianlucajahn/image/upload/v1658582251/fifa3_faiswk.jpg",
            "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238406/fifa_3_rwnx2k.jpg"
        ]
    },
    // {
    //     name: "Whac-A-Mole",
    //     surname: "Whac-A-Mole",
    //     price: "11.99",
    //     desc: 'Whack a mole action game! Hit the mole by touch! Mole monsters invade the peaceful farms! The mole monsters proliferate to ruin the elaborately cultivated field. Kick out the mole monsters without missing to save our farms! Now it’s time to show your ‘instant reaction’ to kick out the mole monsters.',
    //     link: <WackMole/>,
    //     release: '16th of November, 2004',
    //     platforms: 'Android, Linux, Xbox 360, Mac, Xbox, PC, PlayStation 3',
    //     genre: 'Classic',
    //     developers: 'Valve',
    //     publishers: 'Valve',
    //     inCart: false,
    //     selected: false,
    //     isHovered: false,
    //     isLiked: false,
    //     rating: 91,
    //     id: 5,
    //     cover: "https://i.imgur.com/dJmt4FQ.jpg",
    //     footage: [
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658188604/halflife_fiorjc.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238448/halflife_1_nhsnrj.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238448/halflife_2_wpnvmz.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238450/halflife_3_xgil4x.jpg"
    //     ]
    // },
    // {
    //     name: "Bird Shooter",
    //     surname: "birdshooter",
    //     price: "4.99",
    //     desc: 'Counter-Strike: Global Offensive (CS:GO) is a first-person shooter video game which is a part of the Counter-Strike series. It was announced to the public on August 12, 2011, and is developed by Valve Corporation and their partner, Hidden Path Entertainment. The game was later released on August 21, 2012 for the Playstation 3, Xbox 360, Microsoft Windows, macOS and later Linux as a downloadable title.',
    //     link: <Birds />,
    //     release: '21st of August, 2012',
    //     platforms: 'Linux, Xbox 360, Mac, PC, PlayStation 3',
    //     genre: 'Shooter',
    //     developers: 'Valve / Hidden Path Entertainment',
    //     publishers: 'Valve',
    //     inCart: false,
    //     selected: false,
    //     isHovered: false,
    //     isLiked: false,
    //     rating: 82,
    //     id: 2,
    //     cover: "https://i.imgur.com/EpxF5SI.jpg",
    //     footage: [
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658188600/csgo_o9whdd.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238547/csgo_1_gne318.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238546/csgo_2_j1tgfo.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238546/csgo_3_qgcwjw.jpg"
    //     ]
    // },
    // {
    //     name: "Connect Four",
    //     surname: "connectfour",
    //     price: "22.99",
    //     desc: 'Like its predecessors Crusader Kings and Crusader Kings II, Crusader Kings III is a grand strategy game and dynasty simulator set in the Middle Ages. Players begin as a character in either 867 or 1066. The game map is about four times more detailed than the one in Crusader Kings II and slightly larger, incorporating Europe, Africa roughly as far south as the Equator, and Asia as far East as Tibet. Upon the death or deposition of a players character they may continue to play as that characters heir. Overall, players develop a dynasty over the centuries, with the game ending in 1453.',
    //     link: <ConnectFourGame/>,
    //     release: '1st of September, 2020',
    //     platforms: 'Linux, Mac, PlayStation 5, PC, Xbox Series S/X',
    //     genre: 'Strategy',
    //     developers: 'Paradox Development Studios',
    //     publishers: 'Paradox Interactive',
    //     inCart: false,
    //     selected: false,
    //     isHovered: false,
    //     isLiked: false,
    //     rating: 85,
    //     id: 3,
    //     cover: "https://i.imgur.com/Zx69W5y.jpg",
    //     footage: [
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658188601/crusaderkings_fpz1te.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/c_scale,q_100,w_1920/v1658238507/crusaderkings_1_m5wm5p.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238507/crusaderkings_2_pmrmcc.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238506/crusaderkings_3_hdzha4.jpg"
    //     ]
    // },
    // {
    //     name: "Sweet Crush",
    //     surname: "sweetcrush",
    //     price: "65.99",
    //     desc: 'Set in Detroit during the year 2038, the city has been revitalized by the invention and introduction of androids into everyday life. But when androids start behaving as if they are alive, events begin to spin out of control. Step into the roles of the story’s pivotal three playable characters (Kara, Connor, and Markus), each with unique perspectives, motivations and abilities as they face their true selves and question their values. These three androids are present throughout the game as they follow through an emotional journey with choices that must be taken in order for their ultimate cause, which can be defined many different ways depending on the values of the player. The plot of the game deals with a variety of mature themes that explore moral ground and each player decision affects what will happen.',
    //     link: <SweetCrush />,
    //     release: '25th of May, 2018',
    //     platforms: 'PC',
    //     genre: 'Puzzle',
    //     developers: 'Quantic Dream',
    //     publishers: 'Sony Interactive Entertainment / Quantic Dream',
    //     inCart: false,
    //     selected: false,
    //     isHovered: false,
    //     isLiked: false,
    //     rating: 89,
    //     id: 4,
    //     cover: "https://i.imgur.com/nx8CWCX.jpg",
    //     footage: [
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658188602/detroit_a4kqkx.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/c_scale,q_100,w_1920/v1658238582/detroit_1_i8im17.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/c_scale,q_100,w_1920/v1658238582/detroit_2_yacxie.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238578/detroit_3_truscr.jpg"
    //     ]
    // },
    // {
    //     name: "Pacman",
    //     surname: "pacman",
    //     price: "65.99",
    //     desc: 'Pac-Man is an action maze chase video game; the player controls the eponymous character through an enclosed maze. The objective of the game is to eat all of the dots placed in the maze while avoiding four colored ghosts — Blinky (red), Pinky (pink), Inky (cyan), and Clyde (orange) — that pursue Pac-Man.',
    //     link: <Pacman />,
    //     release: '25th of May, 2018',
    //     platforms: 'PC',
    //     genre: 'Puzzle',
    //     developers: 'Quantic Dream',
    //     publishers: 'Sony Interactive Entertainment / Quantic Dream',
    //     inCart: false,
    //     selected: false,
    //     isHovered: false,
    //     isLiked: false,
    //     rating: 89,
    //     id: 5,
    //     cover: "https://i.imgur.com/snTTcFQ.jpg",
    //     footage: [
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658188602/detroit_a4kqkx.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/c_scale,q_100,w_1920/v1658238582/detroit_1_i8im17.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/c_scale,q_100,w_1920/v1658238582/detroit_2_yacxie.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238578/detroit_3_truscr.jpg"
    //     ]
    // },
    // {
    //     name: "Space Invaders",
    //     surname: "spaceinvaders",
    //     price: "17.99",
    //     desc: 'Space Invaders is a classic arcade game in which you need to shoot down all the aliens. Release Date. 1978. Developer. Space Invaders was made by Taito. Version.',
    //     link: <SpaceInvaders />,
    //     release: '4th of March, 2013',
    //     platforms: 'PC',
    //     genre: 'Shooter',
    //     developers: 'Jazzie-z',
    //     publishers: 'HoseaCodes',
    //     inCart: false,
    //     selected: false,
    //     isHovered: false,
    //     isLiked: false,
    //     isActive: true,
    //     rating: 85,
    //     id: 6,
    //     cover: "https://i.imgur.com/0ykyWwZ.png",
    //     footage: [
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/c_scale,q_100,w_1920/v1658188613/tombraider_qx2xiy.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238650/tombraider_1_jxeua4.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238650/tombraider_2_fnhmmd.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238650/tombraider_3_cr0yee.jpg"
    //     ]
    // },
    // {
    //     name: "Tic Tac Toe",
    //     surname: "tictactoe",
    //     price: "17.99",
    //     desc: 'Tic-tac-toe, noughts and crosses, or Xs and Os is a paper-and-pencil game for two players who take turns marking the spaces in a three-by-three grid with X or O. The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row is the winner.',
    //     link: <TicTacToe/>,
    //     release: '4th of March, 2013',
    //     platforms: 'PC',
    //     genre: 'Strategy',
    //     developers: 'Crystal Dynamics',
    //     publishers: 'Square Enix Europe',
    //     inCart: false,
    //     selected: true,
    //     isHovered: false,
    //     isLiked: false,
    //     isActive: true,
    //     rating: 85,
    //     id: 11,
    //     cover: "https://i.imgur.com/b32NKSk.jpg",
    //     footage: [
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/c_scale,q_100,w_1920/v1658188613/tombraider_qx2xiy.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238650/tombraider_1_jxeua4.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238650/tombraider_2_fnhmmd.jpg",
    //         "https://res.cloudinary.com/gianlucajahn/image/upload/v1658238650/tombraider_3_cr0yee.jpg"
    //     ]
    // },
]

export const templateGame = {
  name: 'Game not found',
  surname: '404',
  price: '??.??',
  desc: 'The game you tried to look for has not been found within our database. You can find a full list of our featured games in the browse section on our shop. Click the Store button in the top left corner to get back to the browse section. To avoid similar issues in the future, please do not try to access game pages by typing game names into the URL. The game might be called slightly different in our database, resulting in an error when trying to fetch the page data.',
  link: 'https://gianlucajahn.github.io/react-ecommerce-store/browse',
  release: 'No release date found',
  platforms: 'None',
  genre: 'None',
  developers: 'None',
  publishers: 'None',
  inCart: false,
  selected: false,
  isHovered: false,
  isLiked: false,
  rating: 0,
  id: 33,
  cover: 'https://res.cloudinary.com/gianlucajahn/image/upload/c_scale,q_100,w_500/v1658843471/questionmark_wzexkq.png',
  footage: [
    'https://res.cloudinary.com/gianlucajahn/image/upload/v1658843471/questionmark_wzexkq.png',
    'https://res.cloudinary.com/gianlucajahn/image/upload/v1658843471/questionmark_wzexkq.png',
    'https://res.cloudinary.com/gianlucajahn/image/upload/v1658843471/questionmark_wzexkq.png',
    'https://res.cloudinary.com/gianlucajahn/image/upload/v1658843471/questionmark_wzexkq.png',
  ],
};

export default games;