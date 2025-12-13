export const extractTextFromNode = (node: any): string => {
  if (!node || typeof node !== 'object') return ''
  if (node.type === 'text' && node.text) return node.text
  if (Array.isArray(node.children)) {
    return node.children
      .map((child: any) => extractTextFromNode(child))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  return ''
}

export const extractPlainText = (content: any): string => {
  if (!content || typeof content !== 'object') return ''
  // Lexical serialized state style
  if (content.root && Array.isArray(content.root.children)) {
    return content.root.children
      .map((child: any) => extractTextFromNode(child))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  // If it's already a string
  if (typeof content === 'string') return content
  return ''
}
