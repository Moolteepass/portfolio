import { ListObjectsV2Command } from "@aws-sdk/client-s3"
import { s3Client } from "@/config/aws-config.jsx"
import Image from "next/image"
import Link from "next/link"
import FadeInWrapper from "@/components/FadeInWrapper"

async function fetchImages() {
  const params = {
    Bucket: "monkey-media-portfolio-images",
    Prefix: `photography/covers`,
  }
  try {
    const command = new ListObjectsV2Command(params)
    const data = await s3Client.send(command)
    const imageObjects = data.Contents.filter(
      (object) => !object.Key.endsWith("/")
    ) // Filter out folder-like objects
      .map((object) => {
        const url = `https://${params.Bucket}.s3.amazonaws.com/${object.Key}`
        const filename = object.Key.split("/").pop() // Get the filename without path
        const title = filename
          .split(".")[0]
          .replace(/-/g, " ")
          .replace(/^\d+\s*/, "") // Remove extension, hyphens, and leading numbers
        return { url, title }
      })

    // Define your project titles
    const projectTitles = ["events", "corporate", "stageshows", "wildlife"]

    // Assign titles to the images
    return imageObjects.map((obj, index) => ({
      ...obj,
      title: projectTitles[index] || obj.title, // Use predefined title if available, otherwise use filename-based title
    }))
  } catch (error) {
    console.error("Error fetching images:", error)
    return []
  }
}

export default async function Photography() {
  const projectImages = await fetchImages()

  return (
    <FadeInWrapper>
      <div className="image-container">
        {projectImages.map((project, index) => (
          <div
            key={index}
            className="image-wrapper"
            style={{ position: "relative" }}
          >
            <Link href={`/projects/photography/${project.title}`}>
              <div
                className="image-content"
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <Image
                  priority
                  src={project.url}
                  fill
                  sizes="100vh"
                  alt={project.title}
                  style={{ objectFit: "cover" }}
                />
                <h1 className="image-title">{project.title.toUpperCase()}</h1>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </FadeInWrapper>
  )
}
