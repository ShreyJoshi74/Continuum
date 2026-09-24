import { describe, expect, it } from "vitest";
import {
  Button,
  IconButton,
  Badge,
  Card,
  Rail,
  RailHeader,
  Skeleton,
  Spinner,
  ProgressBar,
  EmptyState,
  FocusRing,
  SafeArea,
  GridCell,
  TextField,
  Modal,
} from "./index";

describe("@continuum/ui barrel", () => {
  it("exports every component the package currently ships", () => {
    for (const component of [
      Button,
      IconButton,
      Badge,
      Card,
      Rail,
      RailHeader,
      Skeleton,
      Spinner,
      ProgressBar,
      EmptyState,
      FocusRing,
      SafeArea,
      GridCell,
      TextField,
      Modal,
    ]) {
      expect(typeof component).toBe("function");
    }
  });
});
