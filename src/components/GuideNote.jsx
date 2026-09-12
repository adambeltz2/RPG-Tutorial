function GuideNote({ title = "Game Master's Guide", children }) {
  return (
    <div className="border-2 border-dashed border-ink-400 bg-parchment-50/70 p-3 text-sm text-ink-600">
      <span className="font-heading text-xs tracking-widest text-ink-500 uppercase">📖 {title}</span>
      <p className="mt-1 leading-relaxed">{children}</p>
    </div>
  )
}

export default GuideNote
