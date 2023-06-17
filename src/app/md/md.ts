export const MARKDOWN_1 = `
<h1>Que es inject()?</h1>
<p>A partir de la versión 14 de Angular, se puso a disposición una función llamada "inject()". Esta toma un InjectionToken como parámetro y devuelve el valor de ese InjectionToken. Básicamente, es otra forma de obtener una dependencia que no sea usar la inyección del constructor. Aquí hay un ejemplo.</p>

---

# Que es inject()?

A partir de la versión 14 de Angular, se puso a disposición una función llamada "inject()". Esta toma un InjectionToken como parámetro y devuelve el valor de ese InjectionToken. Básicamente, es otra forma de obtener una dependencia que no sea usar la inyección del constructor. Aquí hay un ejemplo.

\`\`\`typescript
export class MyComponent {
  constructor(private http:HttpService) { }
}

export class MyComponentInjectable {
  private http = inject(HttpService);
}
\`\`\`
  

  # Ejemplo de Markdown con componente personalizado  
¡Hola! Este es un ejemplo de Markdown que utiliza un componente personalizado en Angular.  
[info]
Este es un mensaje de información que será renderizado dentro del componente personalizado \`InfoComponent\`.
[/info]

## Otro contenido

Aquí puedes agregar más contenido Markdown normal.  

[info]
Este es otro mensaje de información.
Puedes agregar contenido adicional aquí.
[/info]


[info]
# Este es un título.
Esto es texto normal y **esto está en negrita**.
[/info]

# H1
## H2
### H3
#### H4
##### H5
###### H6

Alternatively, for H1 and H2, an underline-ish style:

Alt-H1
======

Alt-H2
------

> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

hr

---
\` hola\`

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

`;
export const MARKDOWN_2 = `# Que es inject()?

A partir de la versión 14 de Angular,
`;
