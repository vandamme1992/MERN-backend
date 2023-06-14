import Post from "../models/Post.js";


export const createComment = async (req,res) => {
    try {
    const {postId, comment} = req.body

        if(!comment) return  res.json({message: 'Коментарий не может быть пустым'})

        const newComment = new Comment({comment})
        await newComment.save()

        try {
await Post.findByIdAndUpdate(postId, {
    $push: {comments: newComment._id}
} )
        }catch (err) {
console.log(err)
        }
 res.json(newComment)
    }catch (err) {
        res.json({message: 'Что-то пошло не так'})
    }
}