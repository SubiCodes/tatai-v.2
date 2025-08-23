import User from "../models/user.model.js";
import Guide from "../models/guide.model.js";
import Report from "../models/report.model.js";

export const getAdminDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalGuides = await Guide.countDocuments();
        const totalPendingGudies = await Guide.countDocuments({ status: "pending" });
        const totalAcceptedGuides = await Guide.countDocuments({ status: "accepted" });
        const totalUnreviewedReports = await Report.countDocuments({ reviewed: false });

        const totalAcceptedRepairGudies = await Guide.countDocuments({ status: "accepted", category: "repair" });
        const totalAcceptedDiyGudies = await Guide.countDocuments({ status: "accepted", category: "diy" });
        const totalAcceptedToolGudies = await Guide.countDocuments({ status: "accepted", category: "tool" });

        const reportsPerMonthPerYear = await getReportsPerMonthPerYear();
        const reportsChartData = transformToChartFormat(reportsPerMonthPerYear);

        return res.status(200).json({
            totalUsers: totalUsers,
            totalGuides: totalGuides,
            totalPendingGudies: totalPendingGudies,
            totalAcceptedGuides: totalAcceptedGuides,
            totalUnreviewedReports: totalUnreviewedReports,
            reportsPerMonthPerYear: reportsChartData,
            liveGuidesByCategory: {
                repair: totalAcceptedRepairGudies,
                tool: totalAcceptedToolGudies,
                diy: totalAcceptedDiyGudies
            }
        });
    } catch (error) {
        console.error("Error in Fetching Dashboard Data", error);
        return res.status(500).json({ success: false, message: `Error Fetching Dashboard Data: ${error}` });
    }
}

// Helper function to transform array format to chart format
function transformToChartFormat(reportsPerMonthPerYear) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const chartData = {};

    Object.keys(reportsPerMonthPerYear).forEach(year => {
        chartData[year] = reportsPerMonthPerYear[year].map((reports, index) => ({
            month: monthNames[index],
            reports: reports
        }));
    });

    return chartData;
}

//Function for getting reports per month for a specific year
async function getReportsPerMonthPerYear() {
    try {
        const currentYear = new Date().getFullYear();
        const startYear = 2025;

        // Create aggregation pipeline to get reports grouped by year and month
        const pipeline = [
            {
                $match: {
                    createdAt: { $gte: new Date(`${startYear}-01-01`) }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ];

        const results = await Report.aggregate(pipeline);

        // Initialize the result object with years from 2025 to current year
        const reportsData = {};

        for (let year = startYear; year <= currentYear; year++) {
            // Initialize each year with 12 months of 0
            reportsData[year] = new Array(12).fill(0);
        }

        // Fill in the actual data from aggregation results
        results.forEach(result => {
            const { year, month } = result._id;
            const count = result.count;

            if (reportsData[year]) {
                // MongoDB months are 1-based, array is 0-based
                reportsData[year][month - 1] = count;
            }
        });

        return reportsData;

    } catch (error) {
        console.error("Error getting reports per month and year:", error);
        // Return empty object or default structure on error
        return { 2025: new Array(12).fill(0) };
    }
}