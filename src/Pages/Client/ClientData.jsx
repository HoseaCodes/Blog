export const clientData = [
    {
        id: 1,
        name: 'Bash Commands',
        date: 'Dec. 14, 2020',
        img: "https://i.imgur.com/GYcr7gZ.png",
        title: 'How to navigate through your terminal',
        type: 'Software Engineer',
        info: ['Bash is a command processor that tyipcally runs in a text window where the user types commands that cause actions. I am sure you have seen a terminal window before. It is that window that gives you that Steve Jobs or early 90s Microsoft feeling when you look at it.',
            'If looks could kill I am sure the command line has taken many people out of their tech lives. For the most part most of us are not use to seeing a computer program that does not have a user friendly experience. That is right the terminal is the same concept as your favorite website. The difference is that your terminal was created to aid your os, operating system, to do it job.',
            'On top of the overwhelming looks of the command line there are over 150+ commands. As a new developer that can be daunting but lucky enough develops love to help one another out. So let\'s breakdown what you will need in order to start using bash commands. I also have a list of commands on my git hub to help new developers',
            'At this point you may be thinking I can do everything you are talking about without using the terminal. This is very true but the benefit is doing this from one centrlized location which means you will save a lot of time. As you grow you will begin to realize become more effecient is a core concept to being a developer. Commands give developers the tools to manipulate every aspect of their device and systems they use. They can do this through a list of options that come with every command to assist with any type of issue you may have. Working in the comamand line is essential if you plan on developing at any capcity.',
        ],
        subHeading: ['What is bash?',
            'How relavent is the command line?',
        ],
        tags: ['Bash', 'Software Engineer'],
        link: './bash',
        lists: ['ls - List of Directorys as known as folders', '\n pwd - Print working directory or show which folder you are in',
            '\n cd - Change directory or switch folders', '\n mkdir - Creates a directory or create a new folder',
            '\n rmdir - Remove directory or delete a folder',
            '\n clear - Clear your terminal window ',
            '\n cp - Copy files and directory - you can use this to copy a single file or folder.',
            '\n mv - Move or rename directory - you can use this to move a single file or folder to any location on your computer.',
            '\n  rm - Delete a file - to delete a single file or folder.', '\n  touch - Creates a file',
            '\n q () - Quit the function or to leave the active service you were using ',
        ]

    },
    {
        id: 2,
        name: 'Big O Notation',
        date: 'Dec. 23, 2020',
        img: "https://i.imgur.com/kFCusLd.png",
        title: 'Time & Space Complexity',
        type: 'Software Engineer',
        info: ['Big O time is the lanuage and metric we use to describe the efficiency of algorithms. The Big O notation defines an upper bound of an algorithm, it bounds a function only from above. In general cases, we mainly used to measure and compare the worst-case theoretical running time complexities of algorithms for the performance analysis. The fastest possible running time for any algorithm is O(1), commonly referred to as Constant Running Time. In this case, the algorithm always takes the same amount of time to execute, regardless of the input size. This is the ideal runtime for an algorithm, but it’s rarely achievable. In actual cases, the performance (Runtime) of an algorithm depends on n, that is the size of the input or the number of operations is required for each input item. ',
            '1.) Figure out what the input is and what n represents.\n 2.) Express the maximum number of operations, the algorithm performs in terms of n. \n 3.) Eliminate all excluding the highest order terms. \n 4.) Remove all the constant factors.',
            'Typically, we are usually interested in the worst case: what is the maximum number of operations that might be performed for a given problem size. For example, inserting an element into an array, we have to move the current element and all of the elements that come after it one place to the right in the array. In the worst case, inserting at the beginning of the array, all of the elements in the array must be moved. Therefore, in the worst case, the time for insertion is proportional to the number of elements in the array, and we say that the worst-case time for the insertion operation is linear in the number of elements in the array. For a linear-time algorithm, if the problem size doubles, the number of operations also doubles.',
            'What Big O notation doesn\'t tell you is the speed of the algorithm in seconds. There are way too many factors that influence the time an algorithm takes to run. Instead, you\'ll use Big O notation to compare different algorithms by the number of operations they make.',
            'Firstly, the implementation of the program is responsible for memory usage. For example, we can assume that recursive implementation always reserves more memory than the corresponding iterative implementation of a particular problem. And the other one is n, the input size or the amount of storage required for each item. For example, a simple algorithm with a high amount of input size can consume more memory than a complex algorithm with less amount of input size. In general for an algorithm, space efficiency and time efficiency reach at two opposite ends and each point in between them has a certain time and space efficiency. So, the more time efficiency you have, the less space efficiency you have and vice versa.',
        ],
        subHeading: ['Upper Bound of the Algorithm',
            'How to find the time complexity',
            'The algorithms can be classified as follows from the best-to-worst performance (Running Time Complexity):',
            'Analyze Runtime',
            'Memory Footprint of the algorithm or Space Complexity'
        ],
        tags: ['BigO', 'Time', 'Space'],
        link: './bigo',
        lists: [
            'A constant algorithm - O(1)',
            'A linear algorithm – O(n) Runtime grows directly in proportion to n. Ex. Linear Search',
            'A logarithmic algorithm – O(log(n)) Runtime grows logarithmically in proportion to n. Ex. Binary Search',
            'A quadratic algorithm - o(n^2)',
            'A polynomial algorithm – O(n^c) Runtime grows quicker than previous all based on n. Ex. Strassen’s Matrix Multiplication, Bubble Sort, Selection Sort, Insertion Sort, or Bucket Sort',
            'A superlinear algorithm – O(nlogn) Runtime grows in proportion to n. Ex, Heap Sort or Merge Sort',
            'A exponential algorithm – O(c^n)Runtime grows even faster than polynomial algorithm based on n. Ex. Tower of Hanoi',
            ' A factorial algorithm – O(n!) Runtime grows the fastest and becomes quickly unusable for even small values of n. Ex. Determinant Expansion by Minors, Brute force Search algorithm for Traveling Salesman Problem.',
            'Where, n is the input size and c is a positive constant. ',
        ],
        lists2: [
            'Logarithmic algorithm - O(log n) - Merge Sort.',
            'Linear algorithm - O(n) - Quick Sort.',
            'Sub-linear algorithm - O(n+k) - Radix Sort.',
            'Ideal algorithm - O(1) - Linear Search, Binary Search, Bubble Sort, Selection Sort, Insertion Sort, Heap Sort, or Shell Sort.',
        ]


    },
    {
        id: 3,
        name: 'React Security',
        date: 'April. 2, 2021',
        img: "https://i.imgur.com/mB89whp.jpg",
        title: 'What in the data is going on?',
        type: 'Software Engineer',
        info: ['When building client facing appplications security is essential. To ensure we are starting with a strong base we will not only define terms but we will talk about solutions. SSL, HTTPS, Cookie & Sessions, JWT.',
            'Securing user data is essential. Most notably using JSON Web Token (JWT) - allows you to decode, verify and generate JWT, OAuth -enables a third-party application to obtain limited access to an HTTP service, either on behalf of a resource owner by orchestrating an approval interaction between the resource owner and the HTTP service, or by allowing the third-party application to obtain access on its own behalf, AuthO - adds authentication and authorization services to your applications, React Router - a collection of navigational components that compose declaratively with your application, and PassportJS - authentication middleware for Node.js',
            '1.) Placing your authenication on the backend will create a few layers for an unaothrized coder to break into. \n 2.) When you handle any user information use HTTPS not HTTP',
            '1.) Mind your console.log(). It is common to use console.logs for debugging but leaving them in production code adds an easy way for someone to break into your application.\n 2.) Express the maximum number of operations, the algorithm performs in terms of n. \n 3.) Eliminate all excluding the highest order terms. \n 4.) Remove all the constant factors.',
            'DDoS attacks - the application is not secure enough or has some loopholes in masking IPs of services. Causing the server to stop from the lost connection. A quick fix is limiting the rate on your APIs, add client-side restrictions to your API, making calls to the server and passing data to the client-side, and testing the application. ANother attack is Cross-Site Scripting (XSS) - the injected code from the attacker will be excuted as application code giving the attacker complete control over the application running in the user\'s browser. Cross-site Request Forgery (CSRF) attacks - through unathorized cookies placed within your app by the attacker forcing an end user to execute unwanted actions on a web application in which they\re currently authenticated. Develops can handle the attacks bu handling sessions, and sending request to server. Application Crashs causes credential to be left out in the open. Using multi-factor authorization, cloud-based authentication, and intensive error handling on the data requests. Secure againt libraries or components. You expose your application to the security or lack thereof from the original developers.  ',
        ],
        subHeading: [
            'Security Fundamentals',
            'Secure your HTTP authentication',
            'How to secure your code',
            'Common misktakes',
            'Types of security breaches',
            'Dot ENV (.env) & Git Ignorore (.gitignore)',
        ],
        tags: ['BigO', 'Time', 'Space'],
        link: './reactsecurity',
        references: ['https://dev.to/vaibhavkhulbe/7-security-tips-for-your-react-application-4e78',],
        lists: [
            'A constant algorithm - O(1)',
            'A linear algorithm – O(n) Runtime grows directly in proportion to n. Ex. Linear Search',
            'A logarithmic algorithm – O(log(n)) Runtime grows logarithmically in proportion to n. Ex. Binary Search',
            'A quadratic algorithm - o(n^2)',
            'A polynomial algorithm – O(n^c) Runtime grows quicker than previous all based on n. Ex. Strassen’s Matrix Multiplication, Bubble Sort, Selection Sort, Insertion Sort, or Bucket Sort',
            'A superlinear algorithm – O(nlogn) Runtime grows in proportion to n. Ex, Heap Sort or Merge Sort',
            'A exponential algorithm – O(c^n)Runtime grows even faster than polynomial algorithm based on n. Ex. Tower of Hanoi',
            ' A factorial algorithm – O(n!) Runtime grows the fastest and becomes quickly unusable for even small values of n. Ex. Determinant Expansion by Minors, Brute force Search algorithm for Traveling Salesman Problem.',
            'Where, n is the input size and c is a positive constant. ',
        ],
        lists2: [
            'Logarithmic algorithm - O(log n) - Merge Sort.',
            'Linear algorithm - O(n) - Quick Sort.',
            'Sub-linear algorithm - O(n+k) - Radix Sort.',
            'Ideal algorithm - O(1) - Linear Search, Binary Search, Bubble Sort, Selection Sort, Insertion Sort, Heap Sort, or Shell Sort.',
        ]


    },
    {
        id: 4,
        name: 'Intro to Design',
        date: 'April. 2, 2021',
        img: "https://i.imgur.com/mB89whp.jpg",
        title: 'What in the data is going on?',
        type: 'Design',
        info: ['Figma, Color Theory, Color Pallete, Typography, Design Pattern',
            '1.) Placing your authenication on the backend will create a few layers for an unaothrized coder to break into. \n 2.) When you handle any user information use HTTPS not HTTP',
            '1.) Mind your console.log(). It is common to use console.logs for debugging but leaving them in production code adds an easy way for someone to break into your application.\n 2.) Express the maximum number of operations, the algorithm performs in terms of n. \n 3.) Eliminate all excluding the highest order terms. \n 4.) Remove all the constant factors.',
            'DDoS attacks - the application is not secure enough or has some loopholes in masking IPs of services. Causing the server to stop from the lost connection. A quick fix is limiting the rate on your APIs, add client-side restrictions to your API, making calls to the server and passing data to the client-side, and testing the application. ANother attack is Cross-Site Scripting (XSS) - the injected code from the attacker will be excuted as application code giving the attacker complete control over the application running in the user\'s browser. Cross-site Request Forgery (CSRF) attacks - through unathorized cookies placed within your app by the attacker forcing an end user to execute unwanted actions on a web application in which they\re currently authenticated. Develops can handle the attacks bu handling sessions, and sending request to server. Application Crashs causes credential to be left out in the open. Using multi-factor authorization, cloud-based authentication, and intensive error handling on the data requests. Secure againt libraries or components. You expose your application to the security or lack thereof from the original developers.  ',
        ],
        subHeading: [
            'Security Fundamentals',
            'Secure your HTTP authentication',
            'How to secure your code',
            'Common misktakes',
            'Types of security breaches',
            'Dot ENV (.env) & Git Ignorore (.gitignore)',
        ],
        tags: ['BigO', 'Time', 'Space'],
        link: './reactsecurity',
        references: ['https://dev.to/vaibhavkhulbe/7-security-tips-for-your-react-application-4e78',],
        lists: [
            'A constant algorithm - O(1)',
            'A linear algorithm – O(n) Runtime grows directly in proportion to n. Ex. Linear Search',
            'A logarithmic algorithm – O(log(n)) Runtime grows logarithmically in proportion to n. Ex. Binary Search',
            'A quadratic algorithm - o(n^2)',
            'A polynomial algorithm – O(n^c) Runtime grows quicker than previous all based on n. Ex. Strassen’s Matrix Multiplication, Bubble Sort, Selection Sort, Insertion Sort, or Bucket Sort',
            'A superlinear algorithm – O(nlogn) Runtime grows in proportion to n. Ex, Heap Sort or Merge Sort',
            'A exponential algorithm – O(c^n)Runtime grows even faster than polynomial algorithm based on n. Ex. Tower of Hanoi',
            ' A factorial algorithm – O(n!) Runtime grows the fastest and becomes quickly unusable for even small values of n. Ex. Determinant Expansion by Minors, Brute force Search algorithm for Traveling Salesman Problem.',
            'Where, n is the input size and c is a positive constant. ',
        ],
        lists2: [
            'Logarithmic algorithm - O(log n) - Merge Sort.',
            'Linear algorithm - O(n) - Quick Sort.',
            'Sub-linear algorithm - O(n+k) - Radix Sort.',
            'Ideal algorithm - O(1) - Linear Search, Binary Search, Bubble Sort, Selection Sort, Insertion Sort, Heap Sort, or Shell Sort.',
        ]


    },

]

export const categoryTags = [

    'Data Structure',
    'Bootcamp',
    'Data Structure',
    'Bash Commands',
    'Software Engineer',
    'Software Engineer',
    'Software Engineer',
    'Software Engineer',

]