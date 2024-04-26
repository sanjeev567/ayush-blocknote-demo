import React, { useState } from "react";
import {
  BlockNoteEditor,
  filterSuggestionItems,
  PartialBlock,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteView,
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/react/style.css";
import { HiOutlineLink } from "react-icons/hi";
import Modal from "react-modal";

Modal.setAppElement("#root");

// Correctly placed Modal style configuration
const customModalStyles = {
  overlay: {
    backgroundColor: "transparent", // Ensures no background blur or dimming
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const LinkInsertModal = ({ isOpen, onRequestClose, onInsertLink }) => {
  const [url, setUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customModalStyles}
    >
      <h2>Insert Link</h2>
      <input
        type="text"
        placeholder="Link text"
        value={linkText}
        onChange={(e) => setLinkText(e.target.value)}
      />
      <input
        type="url"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        onClick={() => {
          onInsertLink(linkText, url);
          onRequestClose();
        }}
      >
        Insert
      </button>
    </Modal>
  );
};

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const editor = useCreateBlockNote({});

  const insertLink = (text, url) => {
    const currentBlock = editor.getTextCursorPosition().block;
    const linkBlock: PartialBlock = {
      type: "paragraph",
      content: [{ type: "text", text, href: url, styles: { underline: true } }],
    };
    editor.insertBlocks([linkBlock], currentBlock, "after");
  };

  return (
    <div>
      <BlockNoteView editor={editor} slashMenu={false}>
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async (query) =>
            filterSuggestionItems(
              [
                ...getDefaultReactSlashMenuItems(editor),
                {
                  title: "Insert Custom Link",
                  onItemClick: () => setIsModalOpen(true),
                  aliases: ["customlink", "clink"],
                  group: "Other",
                  icon: <HiOutlineLink size={18} />,
                  subtext: "Open a popup to insert a custom link.",
                },
              ],
              query
            )
          }
        />
      </BlockNoteView>
      <LinkInsertModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onInsertLink={insertLink}
      />
    </div>
  );
}
