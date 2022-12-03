import React, { useState,useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {

  const [editorState, setEditorState] = useState("");
   useEffect(() => {
     // console.log(props.content)
     // html-===> draft,
     const html = props.content;
     if (html === undefined) return;
     const contentBlock = htmlToDraft(html);
     if (contentBlock) {
       const contentState = ContentState.createFromBlockArray(
         contentBlock.contentBlocks
       );
       const editorState = EditorState.createWithContent(contentState);
       setEditorState(editorState);
     }
   }, [props.content]);

  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="aaaaa"
        wrapperClassName="bbbbb"
        editorClassName="ccccc"
        onEditorStateChange={(editorState) => setEditorState(editorState)}
        onBlur={() => {
          // console.log()

          props.getContent(
            draftToHtml(convertToRaw(editorState.getCurrentContent()))
          );
        }}
      />
    </div>
  );
}

// 下载了这个库
// cnpm i --save react-draft-wysiwyg draft-js
// cnpm i --save draftjs-to-html 
// cnpm i --save html-to-draftjs
// 富文本编辑器