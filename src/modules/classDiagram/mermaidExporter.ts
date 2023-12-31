import { TransformerOutput } from "./transformer";

export function buildClassDiagram(content: TransformerOutput): string {
    let mermaidString = "classDiagram\n";

    content.classes.forEach(c => {
        mermaidString += " ".repeat(4) + `class ${c.name} {\n`;

        switch (c.specialType) {
            case "enum":
                mermaidString += " ".repeat(8) + "<<Enumeration>>\n";
                break;
            case "interface":
                mermaidString += " ".repeat(8) + "<<Interface>>\n";
                break;
        }
        if (c.abstract) {
            mermaidString += " ".repeat(8) + "<<Abstract>>\n";
        }

        c.attributes.forEach(a => {
            let attr = "";
            switch (a.visiblity) {
                case "public":
                    attr += "+";
                    break;
                case "protected":
                    attr += "#";
                    break;
                case "private":
                    attr += "-";
                    break;
            }
            attr += a.name;
            if (a.type) {
                attr += `: ${escapeType(a.type)}`;
            }
            if (a.static) attr += "$";

            mermaidString += " ".repeat(8) + attr + "\n";
        });

        c.methods.forEach(m => {
            let method = "";
            switch (m.visiblity) {
                case "public":
                    method += "+";
                    break;
                case "protected":
                    method += "#";
                    break;
                case "private":
                    method += "-";
                    break;
            }
            method += m.name + "(";
            method += m.parameters.map(par => { 
                if (par.type) {
                    return `${par.name}: ${escapeType(par.type)}`
                }
                return par.name
            }).join(", ");
            method += ")";

            if (m.returnType) {
                method += `: ${escapeType(m.returnType)}`;
            }

            if (m.static) method += "$";

            mermaidString += " ".repeat(8) + method + "\n";
        });

        mermaidString += "    }\n";
    });

    mermaidString += "\n";

    for (const c in content.associations) {
        content.associations[c].forEach(t => {
            mermaidString += " ".repeat(4) + `${c} ..> ${t}\n`;
        });
    }

    return mermaidString;
}

function escapeType(type: string): string {
    return type
        .replaceAll(/<|>/g, "~")
        .replaceAll(/,/g, "，")
        .replaceAll(/\s/g, "");
}