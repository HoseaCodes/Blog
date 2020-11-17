import GA from '../../icons/GA.jpg';
import Stackimg from '../../icons/stack-operations.png'
import project from '../../icons/project.jpg'
import project1 from '../../icons/project1.jpg'
import projects from '../../icons/projects.jpg'

export const articleData = [
    {
        id: 1,
        name: 'General Assembly Bootcamp',
        date: 'Nov. 09, 2020',
        img: GA,
        title: 'Is going to a Bootcamp Worth it?',
        info: ['Coding bootcamps are immersive, intensive technical training programs that focus on getting students on the fast track to a tech career. Though the length of coding bootcamps vary, according to Course Report, the average coding bootcamp lasts about 15 weeks. After completing the program, students should feel ready to apply for an entry-level position. Traditionally coding bootcamps were offered exclusively as onsite, full-time programs and the majority still are. However, the number of options available part time and/or online is growing.',
            'Coding bootcamps are fast-paced, accelerated and oftentimes not designed for complete beginners. They are challenging by design, to ensure that students are prepared for tough technical interviews, and further, the fast-paced environments they’ll eventually work in. To truly master these languages, the students that succeed frequently take on projects on the side, outside of regular work. Many coding bootcamp students come in on weekends and attend meetups, workshops and other conferences not part of regular scheduling. If you’re someone that doesn’t embrace challenging situations and do well under pressure, then a coding bootcamp may not be the best learning environment for you.',
            'A huge advantage of attending a bootcamp is the community of people you’re going through the experience with. You’ll be spending tons of time together, whether it’s learning, studying or going to meetups together. This opportunity to network with like-minded people with similar career goals can be a game-changer – you never know who you meet that can be of help to you later on in your job search. A coding bootcamp will also provide you with individualized attention from instructors that you just can’t get in a self-taught course. These mentors will take time to explain questions to you, work with you after class and answer emails after hours. This kind of one-on-one access is invaluable to your growth as a developer. '
        ],
        subHeading: ['1. What are Coding Bootcamps?',
            '2. Will attending a coding bootcamp help you achieve your career goals?',
            '3. Are you ready for the fast pace of a coding bootcamp?',
            '4. Do you want a community feeling with one-on-one individual attention?',
            '5. Coding Bootcamps: The Pros',
            '6. Coding Bootcamps: The Cons',
        ],
        tags: ['Bootcamp', 'Test'],
        link: './bootcamp',

    },
    {
        id: 2,
        name: 'Data Structure: Stack',
        date: 'Nov. 09, 2020',
        img: Stackimg,
        info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in feugiat mi. Nunc cursus vehicula elit ac porta. Etiam consequat varius lorem a ullamcorper. Fusce pretium feugiat magna vitae convallis. Aliquam erat volutpat. Etiam at ex nunc. In tempor molestie metus a iaculis. Vivamus cursus nec odio a consequat.',
        tags: ['Data Structures', 'Test'],
        link: './stack',

    },
    {
        id: 3,
        name: 'The Art of Picking a Project',
        img: project,
        info: '>Below is a list of projects ideas for new programers',
        tags: ['Software Engineer'],
        link: '#',
    },
    {
        id: 4,
        name: 'Web vs Client Servers',
        img: project1,
        info: 'A quick breakdown of web and client servers',
        tags: ['Software Engineer'],
        link: '#',
    },
    {
        id: 5,
        name: 'You Down with OOP?',
        img: projects,
        info: 'A brief overview of object oriented programming',
        tags: ['Software Engineer'],
        link: '#',
    },
    {
        id: 6,
        name: 'What is a REST API',
        img: '',
        title: 'What is a REST API?',
        info: ['REST stands for REpresentational State Transfer or REST, application program interface',
            'GET to provide read only access to a resource, PUT to create a new resource, DELETE removes a resource and POST to update an exsiting resource or create a new resource',
            '1. Stateless - requests sent from a client to the server containing all of the necessary information.',
            '2. Client-Server - a uniform interface that seperates the clients from the servers. ',
            '3 Uniform interface - four constraints Resource identification, Resource Manipulation, Self-descriptive messages and Hypermedia as the engine of the app state',
            '4 Cacheable - The client cache can reuse the response data for equivalent responses in the future',
            '5. Layered system - allows an application to be more stable by limiting  component behavior. Enables laod balancing and provides shared caches. Also enhances security as components in each layer cannot interact beyond the next immediate layer.',
            '6. Code on demand - permits a clients code to be downloaded and extended via the interface'
        ],
        subHeading: ['WHat is a REST API?',
            'What is the main function?',
            '6 guiding principles'
        ],
        tags: [],
        link: '#'
    }
]

export const categoryTags = [

    'Data Structure',
    'Bootcamp',
    'Data Structure',
    'Software Engineer',
    'Software Engineer',
    'Software Engineer',
    'Software Engineer',
    'Software Engineer',

]