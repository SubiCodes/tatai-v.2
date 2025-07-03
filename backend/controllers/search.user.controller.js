import Guide from "../models/guide.model.js";
import User from "../models/user.model.js";

export const searchReccomendations = async (req, res) => {
    const { search } = req.body;

    if (!search) {
        return res.status(400).json({ success: false, message: "No search found!" });
    }

    try {
        // Split search into individual words
        const searchWords = search.trim().split(/\s+/);

        // Create regex patterns for each word
        const wordRegexes = searchWords.map(word => new RegExp(word, 'i'));

        // Build user query - search for any word in firstName or lastName
        const userQuery = {
            $or: [
                ...wordRegexes.map(regex => ({ firstName: regex })),
                ...wordRegexes.map(regex => ({ lastName: regex }))
            ]
        };

        const userMatches = await User.find(userQuery).limit(5);

        // Build guide query - search for any word in title or description
        const guideQuery = {
            $and: [
                { status: 'accepted' },
                {
                    $or: [
                        ...wordRegexes.map(regex => ({ title: regex })),
                        ...wordRegexes.map(regex => ({ description: regex }))
                    ]
                }
            ]
        };

        const guideMatches = await Guide.find(guideQuery).limit(5);

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
                // Exact match gets highest score
                if (label === q) return 5;

                // Check how many search words are found in the label
                const wordsFound = searchWords.filter(word =>
                    label.includes(word.toLowerCase())
                ).length;

                // More matched words = higher score
                if (wordsFound === searchWords.length) return 4;
                if (wordsFound > 0) return 3;

                // Fallback to original scoring
                if (label.startsWith(q)) return 2;
                if (label.includes(q)) return 1;
                return 0;
            };

            return score(bLabel) - score(aLabel);
        });

        return res.status(200).json({
            success: true,
            message: "Successfully fetched data.",
            data: combinedResults
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const searchResults = async (req, res) => {
    const { search } = req.body;

    if (!search) {
        return res.status(400).json({ success: false, message: "No search found!" });
    }

    try {
        // Split search into individual words
        const searchWords = search.trim().split(/\s+/).filter(word => word.length > 0);
        console.log("Search words:", searchWords);

        // Build user query using string regex
        const userQuery = {
            $or: [
                ...searchWords.map(word => ({ firstName: { $regex: word, $options: 'i' } })),
                ...searchWords.map(word => ({ lastName: { $regex: word, $options: 'i' } }))
            ]
        };

        const userMatches = await User.find(userQuery).limit(5);

        // Build guide query using string regex
        const guideQuery = {
            $and: [
                { status: 'accepted' },
                {
                    $or: [
                        ...searchWords.map(word => ({ title: { $regex: word, $options: 'i' } })),
                        ...searchWords.map(word => ({ description: { $regex: word, $options: 'i' } }))
                    ]
                }
            ]
        };

        const guideMatches = await Guide.find(guideQuery).populate({
            path: 'posterId',
            select: 'firstName lastName email profileIcon',
        });;

        const formattedUsers = userMatches.map(
            (user) => ({ type: 'user', data: user })
        );

        const formattedGuides = guideMatches.map(
            (guide) => ({ type: 'guide', data: guide })
        );

        const combinedResults = [...formattedUsers, ...formattedGuides];

        // Simple sorting without complex scoring
        const q = search.toLowerCase();
        combinedResults.sort((a, b) => {
            const getLabel = (item) => {
                if (item.type === 'user') {
                    return `${item.data.firstName} ${item.data.lastName}`.toLowerCase();
                }
                if (item.type === 'guide') {
                    return item.data.title.toLowerCase();
                }
                return '';
            };

            const aLabel = getLabel(a);
            const bLabel = getLabel(b);

            // Simple scoring
            const aScore = aLabel.includes(q) ? 1 : 0;
            const bScore = bLabel.includes(q) ? 1 : 0;

            return bScore - aScore;
        });

        return res.status(200).json({
            success: true,
            message: "Successfully fetched data.",
            data: combinedResults
        });

    } catch (error) {
        console.error("Error in searchResults:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}