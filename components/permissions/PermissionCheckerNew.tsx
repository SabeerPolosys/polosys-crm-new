"use client"

function getBasePath(path:string) {
    const parts = path.split('/').filter(Boolean);

    // Keywords to detect where to stop the base path
    const stopKeywords = ['create', 'update'];

    // Find index of the first stop keyword
    const cutoffIndex = parts.findIndex(part =>
        stopKeywords.some(keyword => part.toLowerCase().includes(keyword))
    );

    // Slice path up to that point
    const baseParts = cutoffIndex !== -1
        ? parts.slice(0, cutoffIndex)
        : parts;

    return '/' + baseParts.join('/');
}

// ✅ Valid custom hook
const validatePermission = (pathname: string, type: string, permissions: any[]) => {
  
    const basePath = getBasePath(pathname);
    const permission = permissions?.find((p: any) => p.url === basePath);
    return permission?.[type] || null;
};


export default validatePermission;
