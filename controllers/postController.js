const Post = require('../models/post');
const Tag = require('../models/tag');
// const uploadImageToS3 = require('../utils/s3Upload');


const createPost = async (req, res) => {
    try {
        const { title, desc, tags, image } = req.body;

        if (!title || !desc || !image) {
            return res.status(400).json({ message: 'Title, description, and image are required.' });
        }

        const post = new Post({
            title,
            desc,
            image,
            tags,
        });

        // Upload image to S3
        // const imageUrl = await uploadImageToS3(image);

        // Save post with S3 image URL
        // const post = new Post({
        //     title,
        //     desc,
        //     image: imageUrl, 
        //     tags,
        // });

        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPosts = async (req, res) => {
    try {
        const { keyword, tag, sort, page = 1, limit = 10 } = req.query;

        const filter = {};

        if (keyword) {
            filter.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { desc: { $regex: keyword, $options: 'i' } },
            ];
        }

        if (tag) {
            const tagRecord = await Tag.findOne({ name: tag });
            if (tagRecord) filter.tags = tagRecord._id;
        }

        const options = {
            skip: (page - 1) * limit,
            limit: parseInt(limit),
            sort: sort ? { createdAt: sort === 'asc' ? 1 : -1 } : {},
        };

        const posts = await Post.find(filter)
            .populate('tags', 'name')
            .skip(options.skip)
            .limit(options.limit)
            .sort(options.sort);

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPost, getPosts };
