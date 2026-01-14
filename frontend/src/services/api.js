const API_URL = 'http://localhost:5194/api'

export async function getPosts() {
    const res = await fetch(`${API_URL}/posts`)
    if (!res.ok) {
        throw new Error('Failed to fetch posts!')
    }
    return res.json()
}

export async function searchPosts(keyword) {
    const res = await fetch(
        `${API_URL}/posts/by-keyword/${encodeURIComponent(keyword)}`
    )
    if (!res.ok) {
        throw new Error('Failed to fetch posts!')
    }
    return res.json()
}

export async function getPostById(id) {
    const res = await fetch(`${API_URL}/posts/${id}`)
    if (!res.ok) {
        throw new Error('Failed to fetch posts!')
    }
    return res.json()
}

export async function getCommentsByPost(postId) {
    const res = await fetch(`${API_URL}/comments/by-post/${postId}`)

    if (!res.ok) {
        throw new Error('Failed to fetch comments!')
    }

    return res.json()
}

export async function addComment(postId, comment) {
    const res = await fetch(`${API_URL}/comments/${postId}`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(comment),
    })

    if (!res.ok) {
        throw new Error('Failed to add comment!')
    }
}

export async function apiFetch(url, options = {}) {
    const token = localStorage.getItem('token')

    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Request failed')
    }

    if (res.status === 204) {
        return null
    }

    const text = await res.text()
    return text ? JSON.parse(text) : null
}

export async function getPostsByKeyword(keyword) {
    const res = await fetch(`${API_URL}/api/posts/by-keyword/{keyword}`)
    if (!res.ok) {
        throw new Error('Failed to fetch posts!')
    }
    if (res.status === 204) return null

    const text = await res.text()
    return text ? JSON.parse(text) : null
}
