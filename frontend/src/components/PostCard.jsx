import { Link } from 'react-router-dom'

function PostCard({ post, onOpenPost, onTagClick }) {
    const previewLength = 200

    const preview =
        post.content && post.content.length > previewLength
            ? post.content.slice(0, previewLength) + '...'
            : post.content

    return (
        <div className="card" onClick={() => onOpenPost(post.id)}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                }}
            >
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                        {post.title}
                    </h3>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px',
                            color: '#666',
                            fontSize: '14px',
                        }}
                    >
                        <span
                            style={{
                                backgroundColor: '#f0f0f0',
                                borderRadius: '12px',
                                padding: '4px 10px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            <span>👤</span>
                            <span style={{ fontWeight: '500' }}>
                                {post.authorUsername ||
                                    post.AuthorUsername ||
                                    'Anonymous'}
                            </span>
                        </span>

                        <span style={{ margin: '0 10px' }}>•</span>

                        <span>
                            {post.createdAt
                                ? new Date(post.createdAt).toLocaleDateString(
                                      'sr-RS',
                                      {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric',
                                      }
                                  )
                                : 'Just now'}
                        </span>
                    </div>
                </div>

                <div
                    style={{
                        backgroundColor: '#f0f7ff',
                        color: '#0066cc',
                        borderRadius: '12px',
                        padding: '4px 10px',
                        fontSize: '14px',
                        fontWeight: '500',
                        minWidth: '60px',
                        textAlign: 'center',
                    }}
                >
                    💬 {post.commentsCount || 0}
                </div>
            </div>

            <p
                style={{
                    margin: '10px 0 15px 0',
                    color: '#555',
                    lineHeight: '1.5',
                }}
            >
                {preview}
            </p>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '1px solid #eee',
                }}
            >
                <div>
                    <strong style={{ color: '#666', marginRight: '8px' }}>
                        Tags:
                    </strong>
                    {post.tags?.map((tag) => (
                        <span
                            key={tag}
                            onClick={(e) => {
                                e.stopPropagation()
                                onTagClick(tag)
                            }}
                            style={{
                                marginRight: '8px',
                                color: '#4ea1ff',
                                cursor: 'pointer',
                                backgroundColor: '#f0f7ff',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontSize: '13px',
                                display: 'inline-block',
                                marginBottom: '5px',
                            }}
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                <Link
                    to={`/posts/${post.id}#comments`}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        color: '#4ea1ff',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '500',
                    }}
                >
                    View Comments →
                </Link>
            </div>
        </div>
    )
}

export default PostCard
