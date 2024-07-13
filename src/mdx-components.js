import { CodeBlock } from '@/app/components/codeblock'

export function useMDXComponents(components) {
    return {
      // add ids to headers
      h1: (props) => <h1 id={props.children.toLowerCase().replace(/\s/g, '-')} {...props} />,
      h2: (props) => <h2 id={props.children.toLowerCase().replace(/\s/g, '-')} {...props} />,
      h3: (props) => <h3 id={props.children.toLowerCase().replace(/\s/g, '-')} {...props} />,
      h4: (props) => <h4 id={props.children.toLowerCase().replace(/\s/g, '-')} {...props} />,
      code: (props) => <CodeBlock {...props} />,
      ...components,
    }
  }