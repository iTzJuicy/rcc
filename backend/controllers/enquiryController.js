import Enquiry from "../models/Enquiry.js";
import Project from "../models/Project.js";
import Service from "../models/Service.js";
import Testimonial from "../models/Testimonial.js";
import { notifyNewLead } from "../services/emailService.js";

// Helper to sanitize Excel / CSV cells against Formula Injection
function sanitizeExcelCell(val) {
  let str = String(val ?? "").trim();
  // If cell begins with =, +, -, @, tab, carriage return, prepend with single quote
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export async function submitPublicEnquiry(req, res, next) {
  try {
    // 1. Honeypot check for bots
    if (req.body._gotcha) {
      return res.status(200).json({
        success: true,
        message: "Enquiry submitted successfully.",
      });
    }

    const {
      name,
      email,
      phone,
      subject,
      message,
      projectTitle,
      projectSlug,
      budget,
      timeline,
      location,
      carpetArea,
      projectType,
    } = req.body;

    // 2. Strict Input validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide your full name, email address, and project message.",
      });
    }

    if (name.trim().length < 2 || name.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 100 characters.",
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (message.trim().length < 5 || message.length > 4000) {
      return res.status(400).json({
        success: false,
        message: "Message must be between 5 and 4000 characters.",
      });
    }

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

    const enquiry = await Enquiry.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: (phone || "").trim(),
      subject: (subject || (projectTitle ? `Quotation: ${projectTitle}` : "Website Enquiry")).trim(),
      message: message.trim(),
      projectTitle: (projectTitle || "").trim(),
      projectSlug: (projectSlug || "").trim(),
      budget: (budget || "").trim(),
      timeline: (timeline || "").trim(),
      location: (location || "").trim(),
      carpetArea: (carpetArea || "").trim(),
      projectType: (projectType || "").trim(),
      status: "new",
      ipAddress: String(ip).split(",")[0].trim(),
    });

    // 3. Trigger email notification asynchronously (never blocks response)
    notifyNewLead(enquiry).catch((err) =>
      console.error("[Email Notification Trigger Error]", err)
    );

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully.",
      data: { id: enquiry._id },
    });
  } catch (error) {
    next(error);
  }
}

export async function adminGetEnquiries(req, res, next) {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status && status !== "All") {
      filter.status = status.toLowerCase();
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { subject: { $regex: q, $options: "i" } },
        { message: { $regex: q, $options: "i" } },
        { projectTitle: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * pageSize;

    const total = await Enquiry.countDocuments(filter);
    const enquiries = await Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({
      success: true,
      data: enquiries,
      total,
      page: pageNum,
      pages: Math.ceil(total / pageSize) || 1,
    });
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updates = {};
    if (status) updates.status = status;
    if (typeof notes === "string") updates.notes = notes;

    const enquiry = await Enquiry.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    res.json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteEnquiry(req, res, next) {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    res.json({ success: true, message: "Enquiry removed successfully." });
  } catch (error) {
    next(error);
  }
}

function escapeXml(unsafe) {
  if (unsafe == null) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function adminExportCSV(req, res, next) {
  try {
    const { format = "csv" } = req.query;
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    const headers = [
      "Date",
      "Name",
      "Email",
      "Phone",
      "Subject",
      "Project Reference",
      "Budget",
      "Timeline",
      "Location",
      "Status",
      "Notes",
      "Message",
    ];

    if (format === "xlsx" || format === "excel") {
      const dateStr = new Date().toISOString().slice(0, 10);
      let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Enquiries">
  <Table>
   <Row>`;
      headers.forEach((h) => {
        xml += `<Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`;
      });
      xml += `</Row>`;

      enquiries.forEach((item) => {
        const date = item.createdAt
          ? new Date(item.createdAt).toISOString().split("T")[0]
          : "";
        xml += `<Row>
          <Cell><Data ss:Type="String">${escapeXml(date)}</Data></Cell>
          <Cell><Data ss:Type="String">${escapeXml(item.name)}</Data></Cell>
          <Cell><Data ss:Type="String">${escapeXml(item.email)}</Data></Cell>
          <Cell><Data ss:Type="String">${escapeXml(item.phone)}</Data></Cell>
          <Cell><Data ss:Type="String">${escapeXml(item.subject)}</Data></Cell>
          <Cell><Data ss:Type="String">${escapeXml(item.projectTitle)}</Data></Cell>
          <Cell><Data ss:Type="String">${escapeXml(item.budget)}</Data></Cell>
          <Cell><Data ss:Type="String">${escapeXml(item.timeline)}</Data></Cell>
          <Cell><Data ss:Type="String">${escapeXml(item.location)}</Data></Cell>
          <Cell><Data ss:Type="String">${escapeXml(item.status)}</Data></Cell>
          <Cell><Data ss:Type="String">${escapeXml(item.notes)}</Data></Cell>
          <Cell><Data ss:Type="String">${escapeXml(item.message)}</Data></Cell>
        </Row>`;
      });

      xml += `</Table></Worksheet></Workbook>`;

      res.setHeader("Content-Type", "application/vnd.ms-excel; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=rcc_leads_${dateStr}.xls`
      );
      return res.status(200).send(xml);
    }

    const csvRows = [headers];

    enquiries.forEach((item) => {
      const date = item.createdAt
        ? new Date(item.createdAt).toISOString().split("T")[0]
        : "";

      csvRows.push([
        sanitizeExcelCell(date),
        sanitizeExcelCell(item.name),
        sanitizeExcelCell(item.email),
        sanitizeExcelCell(item.phone),
        sanitizeExcelCell(item.subject),
        sanitizeExcelCell(item.projectTitle),
        sanitizeExcelCell(item.budget),
        sanitizeExcelCell(item.timeline),
        sanitizeExcelCell(item.location),
        sanitizeExcelCell(item.status),
        sanitizeExcelCell(item.notes),
        sanitizeExcelCell(item.message),
      ]);
    });

    // Add UTF-8 BOM (\uFEFF) so Excel opens UTF-8 characters cleanly
    const csvContent = "\uFEFF" + csvRows.map((r) => r.join(",")).join("\r\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=rcc_leads_${new Date().toISOString().slice(0, 10)}.csv`
    );
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
}

export async function adminGetDashboard(req, res, next) {
  try {
    const [
      totalProjects,
      totalServices,
      totalEnquiries,
      newEnquiries,
      totalTestimonials,
      recentEnquiries,
    ] = await Promise.all([
      Project.countDocuments(),
      Service.countDocuments(),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: "new" }),
      Testimonial.countDocuments(),
      Enquiry.find().sort({ createdAt: -1 }).limit(6),
    ]);

    const activity = recentEnquiries.map((enq) => ({
      id: enq._id,
      type: enq.projectTitle ? "quote" : "enquiry",
      title: enq.projectTitle
        ? `Quotation request for ${enq.projectTitle}`
        : `New enquiry from ${enq.name}`,
      subtitle: enq.email,
      date: enq.createdAt,
      status: enq.status,
    }));

    res.json({
      success: true,
      data: {
        stats: {
          totalProjects,
          totalServices,
          totalEnquiries,
          newEnquiries,
          totalTestimonials,
        },
        recentEnquiries,
        recentActivity: activity,
      },
    });
  } catch (error) {
    next(error);
  }
}

export default {
  submitPublicEnquiry,
  adminGetEnquiries,
  adminUpdateStatus,
  adminDeleteEnquiry,
  adminExportCSV,
  adminGetDashboard,
};
