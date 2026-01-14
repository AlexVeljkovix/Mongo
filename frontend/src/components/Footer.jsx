function Footer() {
    return (
        <footer
            style={{
                padding: '16px',
                borderTop: '1px solid #ddd',
                textAlign: 'center',
                marginTop: 'auto',
                opacity: 0.6,
                fontSize: 14,
                color: '#888',
            }}
        >
            @{new Date().getFullYear()} Blog App
        </footer>
    )
}
export default Footer
