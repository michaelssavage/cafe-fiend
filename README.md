# Cafe Fiend

Cafe finder app built with TanStack Start, Supabase, Google Maps, Tailwind CSS, Radix UI, and Lucide React.

User can save cafes to their wishlist, favorites, or hide cafes they don't want to see again.

Final Objective: AI enhanced search so users have more control over what cafe they want to find.

Read more about the project here: [Cafe Fiend](https://michaelsavage.ie/projects/cafe-fiend)

## Update supabase types

- npx supabase login
- dotenv -e .env -- npx supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/types/supabase.type.ts

## Add shadcn component

- `npx shadcn@latest add button`
