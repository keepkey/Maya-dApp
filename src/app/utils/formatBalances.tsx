export function formatCacao(bigIntValue: bigint, decimalMultiplier: bigint) {
    return (Number(bigIntValue) / Number(decimalMultiplier)).toFixed(3).toString();
}

export function formatMaya(bigIntValue: bigint, decimalMultiplier: bigint) {
    return (Number(bigIntValue) / Number(decimalMultiplier)).toFixed(3).toString();
}

