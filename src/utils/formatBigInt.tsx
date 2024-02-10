export function formatCacao(bigIntValue: bigint, decimalMultiplier: bigint) {
    return (bigIntValue / decimalMultiplier).toString();
}