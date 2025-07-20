import "dotenv/config"
import Pocketbase from "pocketbase"
import { flattenErrors } from "./src/utils/errors"
const pb_url = process.env.POCKETBASE_URL
const admin_email = process.env.POCKETBASE_ADMIN_EMAIL
const admin_password = process.env.POCKETBASE_ADMIN_PASSWORD

if(!pb_url) {
  throw new Error("POCKETBASE_URL is not set in the environment variables.")
}
if(!admin_email) {
  throw new Error("POCKETBASE_ADMIN_EMAIL must be set in the environment variables.")
}
if(!admin_password) {
  throw new Error("POCKETBASE_ADMIN_PASSWORD must be set in the environment variables.")
}
const pb = new Pocketbase(pb_url)

await pb.collection("_superusers").authWithPassword(admin_email, admin_password).catch((err) => {
  throw new Error(`Failed to authenticate with Pocketbase: ${err.message}`)
})

pb.collections.create({
  name: "watchlists",
  type: "base",
  listRule:
    "@request.auth.id != '' && (isPublic = true || owner = @request.auth.id || @collection.watchlistShares.user ?= @request.auth.id)",
  viewRule:
    "@request.auth.id != '' && (isPublic = true || owner = @request.auth.id || @collection.watchlistShares.user ?= @request.auth.id)",
  createRule: "@request.auth.id != '' && @request.body.owner = @request.auth.id",
  updateRule:
    "@request.auth.id != '' && (owner = @request.auth.id || (@collection.watchlistShares.user ?= @request.auth.id && @collection.watchlistShares.permission = 'edit'))",
  deleteRule: "@request.auth.id != '' && owner = @request.auth.id",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "editor",
      required: false,
    },
    {
      name: "owner",
      type: "relation",
      required: true,
      collectionId: "users",
    },
    {
      name: "isPublic",
      type: "bool",
      required: false,
    },
    {
      name: "category",
      type: "select",
      required: false,
      values: [
        "movies",
        "tv_shows",
        "mixed",
        "documentaries",
        "anime",
        "comedy",
        "drama",
        "action",
        "horror",
        "sci_fi",
        "romance",
        "thriller",
        "other",
      ],
    },
    {
      name: "coverImage",
      type: "file",
      required: false,
    },
    {
      name: "tags",
      type: "json",
      required: false,
    },
  ],
})
.then((data) => {
  console.log("Collection 'watchlists' created successfully.",data)
})
.catch((err) => {
    console.dir(err, { depth: null, colors: true });
  console.log("flattened error:", flattenErrors(err));  
//   throw new Error(`Failed to create collection 'watchlists': ${err.message}`)
});

