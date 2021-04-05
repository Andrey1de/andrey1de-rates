export function getRenderTableStyle() {
    const style = `
    <style>
        table {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 1.0em !important;
            width: 100%;
        }

        td, th {
            border: 1px solid #ddd;
            padding: 8px;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        tr:hover {
            background-color: #ddd;
        }

        th {
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: left;
            background-color: #4CAF50;
            color: white;
        }

        tr {
            font-size: 0.8em !important;
            font-weight: 600 !important;
        }
    </style>
`   ;
    return style;


}