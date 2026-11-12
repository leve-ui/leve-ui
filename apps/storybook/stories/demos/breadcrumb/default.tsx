import { component$, useStyles$ } from '@builder.io/qwik';
import { Breadcrumb } from '@leve-ui/breadcrumb';
import { LuChevronRight } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Breadcrumb.Root class="breadcrumb-default">
      <Breadcrumb.List class="breadcrumb-default-list">
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#home" class="breadcrumb-default-link">
            Home
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        {/* The library hides the separator from assistive technology */}
        <Breadcrumb.Separator class="breadcrumb-default-separator">
          <LuChevronRight class="breadcrumb-default-separator-icon" aria-hidden="true" />
        </Breadcrumb.Separator>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#components" class="breadcrumb-default-link">
            Components
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator class="breadcrumb-default-separator">
          <LuChevronRight class="breadcrumb-default-separator-icon" aria-hidden="true" />
        </Breadcrumb.Separator>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#breadcrumb" current class="breadcrumb-default-link">
            Breadcrumb
          </Breadcrumb.Link>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
});
