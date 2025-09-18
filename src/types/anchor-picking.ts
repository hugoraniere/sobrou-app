export interface AnchorPickMessage {
  type: 'ANCHOR_PICK_START' | 'ANCHOR_PICK_STOP' | 'ANCHOR_HIGHLIGHT';
  anchorId?: string;
}

export interface AnchorCandidateMessage {
  type: 'ANCHOR_CANDIDATE';
  route: string;
  bbox: DOMRect;
  meta: ElementMetadata;
}

export interface AnchorPickedMessage {
  type: 'ANCHOR_PICKED';
  route: string;
  bbox: DOMRect;
  elementMeta: ElementMetadata;
}

export type PostMessage = AnchorPickMessage | AnchorCandidateMessage | AnchorPickedMessage;

export interface ElementMetadata {
  tagName: string;
  text: string;
  ariaLabel?: string;
  title?: string;
  placeholder?: string;
  role?: string;
  className: string;
  id: string;
  tourId?: string;
  selector: string;
}

export interface AnchorCandidate {
  element: Element;
  metadata: ElementMetadata;
  bbox: DOMRect;
  selector: string;
}

export interface GeneratedAnchor {
  anchor_id: string;
  friendly_name: string;
  kind: string;
  route: string;
  selector: string;
  width: number;
  height: number;
  thumbnail?: Blob;
}