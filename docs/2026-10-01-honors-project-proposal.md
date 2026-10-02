# Honors Project Proposal

**Proposed Title:** Design and Development of a Polynomial Solver Using Symbolic and Numerical Methods

## Project Description

For my honors project, I propose designing and building a computer program that can analyze, simplify, and solve a broad class of polynomial equations using symbolic and numerical methods. This project will combine mathematical theory and computer science by implementing algebraic and numerical problem-solving techniques in a functional software tool.

Polynomials play an important role in mathematics and many applied disciplines. While simpler polynomial equations can often be solved by hand, computational approaches become far more convenient as equations grow more complicated. The proposed program will be designed to accept and parse polynomial equations, interpret their mathematical structure, simplify them when possible, and determine solutions using appropriate methods. I plan to implement this project as a web application using JavaScript and the Vue framework. To handle input parsing, I would likely use a third-party tool or library if one meets the needs of the project; if no available option is suitable, I would develop a parser myself.

Symbolic methods may include simplification, factoring, expansion, algebraic root-finding techniques, and the use of matrices to solve systems of linear equations. For systems of equations with higher degrees, I would research other methods that would be effective for solving them. Numerical methods may include approximation procedures such as Muller's Method, which is particularly useful because it supports complex roots. Because Muller's Method produces numerical approximations, I would also research other methods for generating exact values when possible if the user selects that form of result. To make the program more flexible and useful, I would include a toggle option that allows the user to alternate between exact-value results and numerical approximations.

This project will require research into polynomial theory, symbolic manipulation, numerical analysis, algorithm design, and methods for parsing mathematical input into a form the program can process. In addition to developing the software, I will evaluate its effectiveness by testing it on a range of polynomial problems of varying complexity. The final product will include the completed web application, supporting documentation, and a written analysis of the mathematical methods, the design process, and the solver's limitations.

This honors project goes beyond ordinary coursework by involving independent research, the interdisciplinary application of mathematics and computer science, and the creation of an original computational tool.

## Proposed Outline

### 1. Background Research and Project Planning

- Research polynomial-solving methods, including symbolic and numerical approaches
- Study methods for solving systems of polynomial equations
- Research input parsing tools or libraries that may be used in the project
- Define the scope of the program and determine which classes of polynomial equations the solver will support
- Finalize the overall design goals and technical requirements of the project

### 2. Program Design

- Design the structure of the web application
- Plan the user interface and input format for entering polynomial equations
- Decide how equations will be represented internally within the program
- Determine how the program will distinguish between problems that can be solved symbolically and those that require numerical approximation
- Plan the toggle feature for switching between exact-value output and numerical-value output

### 3. Input Parsing and Equation Processing

- Evaluate third-party tools for parsing mathematical input
- Integrate a suitable parser if one meets the needs of the project
- Develop a custom parser if existing tools are not sufficient
- Build the logic needed to interpret, validate, and simplify polynomial equations entered by the user

### 4. Development of Solving Methods

- Implement symbolic solving methods such as simplification, factoring, expansion, and algebraic root-finding techniques
- Implement matrix-based methods for solving systems of linear equations
- Implement Muller's Method for numerical root approximation, including support for complex roots
- Research and test additional methods for exact solutions when possible
- Research possible methods for solving higher-degree systems of equations

### 5. User Interface and Web App Development

- Build the application using JavaScript and the Vue framework
- Create an interface for entering equations and displaying solutions
- Add controls for choosing output form, including the exact/numerical toggle
- Design the output so that results are clear, readable, and mathematically meaningful

### 6. Testing and Evaluation

- Test the program on a range of polynomial equations of different forms and levels of difficulty
- Test systems of linear equations and other supported systems
- Compare symbolic and numerical outputs for accuracy and consistency
- Identify limitations, bugs, and cases the program cannot yet solve
- Revise the program based on testing results

### 7. Documentation and Final Paper

- Document the mathematical methods used in the solver
- Explain the program design and implementation process
- Describe the strengths and limitations of the final application

### 8. Final Revision and Defense Preparation

- Refine the application and documentation
- Review the full project for clarity and completeness
- Prepare presentation materials for the honors defense
- Practice explaining the goals, methods, and results of the project

## Preliminary Bibliography

- Richard L. Burden and J. Douglas Faires. *Numerical Methods*.
- Robert Sedgewick and Kevin Wayne. *Algorithms*.
- Cppreference. *cppreference.com: C++ Language and Library Reference*.
- MDN Web Docs. *JavaScript Documentation*.
