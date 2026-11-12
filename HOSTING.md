# Free hosting with Render and Neon

1. Create a separate Neon project for recipe-manager-app. Keep its connection string private.
2. In Render, create a Blueprint from this repository. The committed `render.yaml` selects the Free service plan.
3. Set `DATABASE_URL` to the Neon connection string including its SSL settings. For JWT-based apps the blueprint generates a private `JWT_SECRET`.
4. Deploy and verify the public URL. The app creates its PostgreSQL tables at startup.

The Flutter frontend uses GitHub Pages. After deploying the backend, set the repository Actions variable `API_BASE_URL` to your Render URL followed by `/api`. In repository Settings → Pages, choose GitHub Actions. Run the Deploy Flutter Web workflow. The frontend URL is `https://zodvot.github.io/Recipe-Manager-App/`. The backend permits that origin through FRONTEND_ORIGIN. Local Flutter builds can use `--dart-define=API_BASE_URL=http://localhost:3000/api`.

The historical demo-user scripts and MySQL schema are retained for reference and are not part of PostgreSQL setup. Use signup to create accounts.

## Existing data

This deployment creates a fresh PostgreSQL database. It does not transfer existing MySQL accounts, events, recipes, or local business records. Keep existing databases and backups. A data import needs a separate export and validation step before replacing an existing deployment.

## Local PostgreSQL

Use the standard PGHOST, PGPORT, PGDATABASE, PGUSER and PGPASSWORD environment variables, or DATABASE_URL. For the two migrated backends, install dependencies in backend and run `node scripts/init-database.js`, then `npm start`. Set JWT_SECRET before starting. PostgreSQL must already contain the empty target database.

## Free-plan limits

Render free services sleep when idle and share workspace usage limits. Neon has storage and compute limits. Services can wake slowly. Pricing and limits can change.


## Render frontend deployment

The main website is now served by the Render service at its root URL. The Flutter release is checked into `backend/public` so GitHub Actions is not needed to deploy the site. API requests use the relative `/api` path.

After changing Flutter source, run `flutter build web --release --base-href / --dart-define=API_BASE_URL=/api`, copy `build/web` into `backend/public`, and commit the updated release. The optional GitHub Pages workflow is separate from this deployment.
