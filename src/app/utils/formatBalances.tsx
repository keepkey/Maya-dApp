export default function formatCacao(bigIntValue: bigint, decimalMultiplier: bigint) {
    return (Number(bigIntValue) / Number(decimalMultiplier)).toFixed(3).toString();
}

