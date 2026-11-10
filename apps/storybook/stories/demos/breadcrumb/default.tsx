import { component$, useStyles$ } from '@builder.io/qwik';
import { Breadcrumb } from '@leve-ui/breadcrumb';

const styles = `
  .breadcrumb-list {
    display: flex;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .breadcrumb-link[data-current] {
    font-weight: 600;
    text-decoration: none;
    color: inherit;
  }

  .breadcrumb-separator {
    color: #9ca3af;
  }
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <Breadcrumb.Root>
      <Breadcrumb.List class="breadcrumb-list">
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#home" class="breadcrumb-link">
            Home
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator class="breadcrumb-separator">/</Breadcrumb.Separator>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#components" class="breadcrumb-link">
            Components
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator class="breadcrumb-separator">/</Breadcrumb.Separator>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#breadcrumb" current class="breadcrumb-link">
            Breadcrumb
          </Breadcrumb.Link>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
});
