import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://zacourier.example";
  const routes = [
    "",
    "/quote",
    "/booking",
    "/track",
    "/redelivery",
    "/send",
    "/services",
    "/services/domestic",
    "/services/express",
    "/services/ecommerce",
    "/business",
    "/resources",
    "/about",
    "/contact",
    "/login",
    "/register",
    "/claims",
    "/dashboard",
    "/admin",
    "/driver",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
