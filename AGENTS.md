<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Keep simulated transport rules in a browser-safe data module and share session-only demo state through a root provider; passenger reports must update all screens without a server or reload.
- Give journey, bus results, transport status, passenger report and about content separate TanStack routes; spacious screens preserve navigation and independent metadata.
- Define all visual roles and motion in the global design system; feature controls use the shared Button component.
- Treat service and fare categories as explicit data filters, never as automatic ranking advantages; travel conditions determine the recommendation.
- Carry the chosen journey in the bus screen's URL search params and read the search form's own fields at submit time, so a stop picked before the page is interactive still reaches the bus screen.
