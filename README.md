# Three-Lanes — PetClinic Commit Lab

A visual, three-lane commit viewer for studying real changes in [Spring Petclinic](https://github.com/spring-projects/spring-petclinic).

## Open the demo

Open [index.html](./index.html) in a web browser. This is a standalone HTML application; no build process or dependencies are required.

## Layout

- **Backend (left):** SVG engineering diagrams with relevant Java, SQL, or configuration code underneath.
- **Commit timeline (center):** 10 selected GitHub commits expanded into 25 learning steps.
- **Frontend (right):** focused user-facing UI previews with source code underneath.

## Controls

- **View:** visual learning mode and focused code.
- **GitHub:** diagrams and previews alongside authentic commit changes and original source files.
- **View here:** an in-page source comparison.
- **Arrow keys:** navigate the lessons and commits.
- **Search:** find one of the selected commits or steps by number, SHA, or keyword.

The app uses the public GitHub API for exact commit data. Loading original files may require network access and is subject to GitHub's API limits. Diagrams and UI previews are teaching visualizations rather than screenshots of running historical versions.

## Repository

The canonical standalone demo lives at [index.html](./index.html). Source commits are linked back to [spring-projects/spring-petclinic](https://github.com/spring-projects/spring-petclinic).
