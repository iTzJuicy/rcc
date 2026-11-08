import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: path.resolve(".env") });

import User from "../models/User.js";
import Service from "../models/Service.js";
import Project from "../models/Project.js";
import Category from "../models/Category.js";
import Testimonial from "../models/Testimonial.js";
import Stat from "../models/Stat.js";
import Enquiry from "../models/Enquiry.js";
import Media from "../models/Media.js";
import SiteSetting from "../models/SiteSetting.js";

import { connectDB } from "../config/db.js";

async function backup() {
  try {
    await connectDB();

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = path.resolve("backups", `backup-${timestamp}`);

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const collections = [
      { name: "users.json", model: User },
      { name: "services.json", model: Service },
      { name: "projects.json", model: Project },
      { name: "categories.json", model: Category },
      { name: "testimonials.json", model: Testimonial },
      { name: "stats.json", model: Stat },
      { name: "enquiries.json", model: Enquiry },
      { name: "media.json", model: Media },
      { name: "settings.json", model: SiteSetting },
    ];

    for (const col of collections) {
      const data = await col.model.find().lean();
      const filePath = path.join(backupDir, col.name);
      await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
      console.log(`[Backup] Dumped ${data.length} records into ${col.name}`);
    }

    console.log(`[Backup Completed] All database records archived into: ${backupDir}`);
    process.exit(0);
  } catch (err) {
    console.error(`[Backup Error]`, err);
    process.exit(1);
  }
}

backup();
