
'use client'
// import { Empty } from "@/components/Empty";
import theme from "./editor-theme";
import { getDebugTextContent, useIsFocused } from "./editor-utils";
import { cn } from "@/lib/utils";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { $createParagraphNode, $getRoot, EditorState, LexicalEditor } from "lexical";
import { $convertToMentionNodes, BeautifulMentionNode, BeautifulMentionsComboboxItem, BeautifulMentionsItem, BeautifulMentionsPlugin, BeautifulMentionsPluginProps, createBeautifulMentionNode, useBeautifulMentions } from "lexical-beautiful-mentions";
import { Dispatch, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Combobox, ComboboxItem } from "../ui/combobox";
import CustomMentionComponent from "@/components/editor/CustomMentionComponent";
import { Menu, MenuItem } from "@/components/editor/Menu";


const placeholderMentionItems: Record<string, BeautifulMentionsItem[]> = {
  "@": [
    "Anton",
    "Boris",
    "Catherine",
    "Dmitri",
    "Elena",
    "Felix",
    { value: "Gina", id: "1", avatar: null },
    { value: "Gina", id: "2", avatar: "https://example.com/avatars/1.jpg" },
  ],
  "#": ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape"],
  "due:": ["Today", "Tomorrow", "01-01-2023"],
  "rec:": ["week", "month", "year"],
  "\\w+:": [],
};

const queryMentions = async (
  trigger: string,
  queryString: string,
  asynchronous: boolean,
  variables: Record<string, BeautifulMentionsItem[]>
) => {
  const items = variables[trigger];
  if (!items) {
    return [];
  }
  if (asynchronous) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return items.filter((item) => {
    const value = typeof item === "string" ? item : item.value;
    return value.toLowerCase().includes(queryString.toLowerCase());
  });
};

function setEditorState(initialValue: string, triggers: string[]) {
  return () => {
    const root = $getRoot();
    if (root.getFirstChild() === null) {
      const paragraph = $createParagraphNode();
      paragraph.append(...$convertToMentionNodes(initialValue, triggers));
      root.append(paragraph);
    }
  };
}

export default function ComboboxEditor(props: {
  placeholder?: string,
  autoFocus?: boolean,
  value: string,
  name: string,
  variables: Record<string, BeautifulMentionsItem[]>,
  onChange: (e: {
    target: {
      name: string,
      value: string
    }
  }
  ) => any
}) {

  const [CustomBeautifulMentionNode, replacement] = createBeautifulMentionNode(
    CustomMentionComponent,
  );

  function setEditorState(initialValue: string) {
    return (editor: LexicalEditor) => {
      if (!initialValue) {
        editor.update(() => {
          const root = $getRoot();

          if (root.getFirstChild() === null) {
            root.append($createParagraphNode());
          }
        });

        return;
      }

      try {
        const parsed = JSON.parse(initialValue);
        const editorState = editor.parseEditorState(parsed);

        editor.setEditorState(editorState);
      } catch (error) {
        console.error("Failed to parse initial editor value:", error);
      }
    };
  }

  return (
    <div className="flex flex-col w-full">

      <LexicalComposer
        initialConfig={{
          namespace: 'editor_v23',
          theme: theme,
          editorState: setEditorState(props.value),
          onError: (error, editor) => {
            console.error(error)
          },
          nodes: [
            BeautifulMentionNode, CustomBeautifulMentionNode, replacement
          ]
        }}
      >
        <Plugins {...props} />
      </LexicalComposer>
    </div>
  );
}



function Plugins({ placeholder, autoFocus = false, value, name, onChange, variables }: {

  placeholder?: string,
  autoFocus?: boolean,
  value: string,
  name: string,
  onChange: (e: {
    target: {
      name: string,
      value: string
    }
  }) => any
  variables: Record<string, BeautifulMentionsItem[]>
}) {

  const configuration = {
    asynchronous: false,
    autoFocus,
    autoSpace: false,
    allowSpaces: false,
    creatable: false,
    insertOnBlur: false,
    combobox: false,
    mentionEnclosure: '',
    showMentionsOnDelete: false,
    emptyComponent: null,
    _comboboxAdditionalItems: [],
  }

  const comboboxAnchor = useRef<HTMLDivElement>(null);
  const [menuOrComboboxOpen, setMenuOrComboboxOpen] = useState(false);
  const [comboboxItemSelected, setComboboxItemSelected] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(null);
  const focused = useIsFocused();
  const triggers = useMemo(
    () =>
      configuration.combobox
        ? Object.keys(variables).filter((k) => k !== "\\w+:")
        : Object.keys(variables),
    [configuration.combobox],
  );
  const comboboxAdditionalItems = useMemo(
    () =>
      configuration._comboboxAdditionalItems
        ? [
          {
            value: "additionalItem",
            displayValue: "Additional Item",
            data: { dividerTop: true },
          },
        ]
        : [],
    [configuration._comboboxAdditionalItems],
  );

  useEffect(() => {
    setAnchorElement(comboboxAnchor.current);
  }, []);


  const handleChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const value = getDebugTextContent(root);

      const json = editorState.toJSON();
      onChange({
        target: {
          value: JSON.stringify(json),
          name
        }
      });
    });
  }, [name, onChange]);

  const handleSearch = useCallback(
    (trigger: string, queryString: string) =>
      queryMentions(trigger, queryString, configuration.asynchronous, variables),
    [configuration.asynchronous],
  );

  const handleMenuOrComboboxOpen = useCallback(() => {
    setMenuOrComboboxOpen(true);
  }, []);

  const handleMenuOrComboboxClose = useCallback(() => {
    setMenuOrComboboxOpen(false);
  }, []);

  const handleComboboxFocusChange = useCallback(
    (item: BeautifulMentionsComboboxItem | null) => {
      setComboboxItemSelected(item !== null);
    },
    [],
  );

  const handleComboboxItemSelect = useCallback(
    (item: BeautifulMentionsComboboxItem) => {
      if (item.itemType === "additional") {
        setMenuOrComboboxOpen(false);
      }
    },
    [],
  );

  // @ts-ignore
  const beautifulMentionsProps: BeautifulMentionsPluginProps = useMemo(
    () => ({
      mentionEnclosure: configuration.mentionEnclosure,
      allowSpaces: configuration.allowSpaces,
      autoSpace: configuration.autoSpace,
      creatable: configuration.creatable,
      showMentionsOnDelete: configuration.showMentionsOnDelete,
      ...(configuration.asynchronous
        ? {
          onSearch: handleSearch,
          searchDelay: 250,
          triggers,
        }
        : {
          items: variables,
        }),
      ...(configuration.combobox
        ? {
          combobox: configuration.combobox,
          triggers,
          comboboxOpen: menuOrComboboxOpen,
          comboboxAnchor: anchorElement,
          comboboxAnchorClassName: "ring-2 ring-ring ring-offset-2 ring-offset-background rounded-md",
          comboboxComponent: Combobox,
          comboboxItemComponent: ComboboxItem,
          onComboboxOpen: handleMenuOrComboboxOpen,
          onComboboxClose: handleMenuOrComboboxClose,
          onComboboxFocusChange: handleComboboxFocusChange,
          comboboxAdditionalItems,
          onComboboxItemSelect: handleComboboxItemSelect,
        }
        : {
          menuComponent: Menu,
          menuItemComponent: MenuItem,
          // emptyComponent: configuration.emptyComponent ? Empty : undefined,
          onMenuOpen: handleMenuOrComboboxOpen,
          onMenuClose: handleMenuOrComboboxClose,
          insertOnBlur: configuration.insertOnBlur,
        }),
    }),
    [
      configuration.mentionEnclosure,
      configuration.allowSpaces,
      configuration.autoSpace,
      configuration.creatable,
      configuration.showMentionsOnDelete,
      configuration.asynchronous,
      handleSearch,
      triggers,
      configuration.combobox,
      menuOrComboboxOpen,
      anchorElement,
      handleMenuOrComboboxOpen,
      handleMenuOrComboboxClose,
      handleComboboxFocusChange,
      comboboxAdditionalItems,
      handleComboboxItemSelect,
      configuration.emptyComponent,
      configuration.insertOnBlur,
      placeholder
    ],
  );

  return (
    <>
      <div
        ref={comboboxAnchor}
        className={cn(
          "relative text-left",
          !configuration.combobox && "rounded",
          configuration.combobox && !menuOrComboboxOpen && "rounded",
          configuration.combobox && menuOrComboboxOpen && "rounded-t",
        )}
      >
        <RichTextPlugin

          contentEditable={
            <ContentEditable
              style={{ tabSize: 1 }}
              className={cn(
                "h-fit py-2 w-full min-w-0 rounded-md border border-input bg-transparent px-3 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
                "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
              )}
            />
          }
          placeholder={<div className="absolute top-2 left-3 text-gray-400 pointer-events-none text-sm">
            <p>{placeholder}</p>
          </div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={handleChange} />
        <HistoryPlugin />
        <BeautifulMentionsPlugin {...beautifulMentionsProps} />
        {/* {configuration.autoFocus !== "none" && (
          <AutoFocusPlugin defaultSelection={"rootStart"} />
        )} */}
      </div>
      <div className="hidden" data-testid="plaintext">
        {value}
      </div>
      <div className="hidden" data-testid="menu-combobox-open">
        {menuOrComboboxOpen.toString()}
      </div>
      <div className="hidden" data-testid="combobox-item-selected">
        {comboboxItemSelected.toString()}
      </div>
    </>
  );
}




function getRandomItem<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}