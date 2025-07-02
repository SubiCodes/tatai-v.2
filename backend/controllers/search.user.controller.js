import Guide from "../models/guide.model.js";
import User from "../models/user.model.js";

export const searchReccomendations = async (req, res) => {
    const { search } = req.body;

    if (!search) {
        return res.status(404).json({ success: false, message: "No search found!" });
    }

    try {
        const userMatches = await User.find({
            $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
            ],
        }).limit(5);

        const guideMatches = await Guide.find({
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ],
            status: 'accepted'
        }).limit(5);

        const formattedUsers = userMatches.map(
            (user) => `${user.firstName} ${user.lastName}`
        );

        const formattedGuides = guideMatches.map(
            (guide) => guide.title
        );


        const combinedResults = [...formattedUsers, ...formattedGuides];
        const q = search.toLowerCase();

        combinedResults.sort((a, b) => {
            const aLabel = a.toLowerCase();
            const bLabel = b.toLowerCase();

            const score = (label) => {
                if (label === q) return 3;
                if (label.startsWith(q)) return 2;
                if (label.includes(q)) return 1;
                return 0;
            };

            return score(bLabel) - score(aLabel);
        });

        return res.status(200).json({ success: true, message: "Successfully fetched data.", data: combinedResults });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}