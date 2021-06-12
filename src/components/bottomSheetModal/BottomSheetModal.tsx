import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Portal, usePortal } from '@gorhom/portal';
import { nanoid } from 'nanoid/non-secure';
import BottomSheet from '../bottomSheet';
import { useBottomSheetModalInternal } from '../../hooks';
import { print } from '../../utilities';
import {
  DEFAULT_STACK_BEHAVIOR,
  DEFAULT_ENABLE_DISMISS_ON_CLOSE,
} from './constants';
import type { BottomSheetModalMethods, BottomSheetMethods } from '../../types';
import type { BottomSheetModalProps } from './types';

type BottomSheetModal = BottomSheetModalMethods;

const BottomSheetModalComponent = forwardRef<
  BottomSheetModal,
  BottomSheetModalProps
>(function BottomSheetModal(props, ref) {
  const {
    // modal props
    name,
    stackBehavior = DEFAULT_STACK_BEHAVIOR,
    enableDismissOnClose = DEFAULT_ENABLE_DISMISS_ON_CLOSE,
    onDismiss: _providedOnDismiss,

    // bottom sheet props
    index = 0,
    snapPoints,
    enablePanDownToClose = true,
    onChange: _providedOnChange,

    // components
    children,
    ...bottomSheetProps
  } = props;

  //#region state
  const [mount, setMount] = useState(false);
  //#endregion

  //#region hooks
  const {
    containerHeight,
    containerOffset,
    mountSheet,
    unmountSheet,
    willUnmountSheet,
  } = useBottomSheetModalInternal();
  const { removePortal: unmountPortal } = usePortal();
  //#endregion

  //#region refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const currentIndexRef = useRef(-1);
  const restoreIndexRef = useRef(-1);
  const minimized = useRef(false);
  const forcedDismissed = useRef(false);
  const mounted = useRef(true);
  //#endregion

  //#region variables
  const key = useMemo(() => name || `bottom-sheet-modal-${nanoid()}`, [name]);
  //#endregion

  //#region private methods
  const resetVariables = useCallback(function resetVariables() {
    print({
      component: BottomSheetModal.name,
      method: resetVariables.name,
    });
    currentIndexRef.current = -1;
    restoreIndexRef.current = -1;
    minimized.current = false;
    mounted.current = true;
    forcedDismissed.current = false;
  }, []);
  const unmount = useCallback(
    function unmount() {
      print({
        component: BottomSheetModal.name,
        method: unmount.name,
      });
      const _mounted = mounted.current;

      // reset variables
      resetVariables();

      // unmount sheet and portal
      unmountSheet(key);
      unmountPortal(key);

      // unmount the node, if sheet is still mounted
      if (_mounted) {
        setMount(false);
      }

      // fire `onDismiss` callback
      if (_providedOnDismiss) {
        _providedOnDismiss();
      }
    },
    [key, resetVariables, unmountSheet, unmountPortal, _providedOnDismiss]
  );
  //#endregion

  //#region bottom sheet methods
  const handleSnapToIndex = useCallback<BottomSheetMethods['snapToIndex']>(
    (...args) => {
      if (minimized.current) {
        return;
      }
      bottomSheetRef.current?.snapToIndex(...args);
    },
    []
  );
  const handleSnapToPosition = useCallback<
    BottomSheetMethods['snapToPosition']
  >((...args) => {
    if (minimized.current) {
      return;
    }
    bottomSheetRef.current?.snapToPosition(...args);
  }, []);
  const handleExpand = useCallback((...args) => {
    if (minimized.current) {
      return;
    }
    bottomSheetRef.current?.expand(...args);
  }, []);
  const handleCollapse = useCallback((...args) => {
    if (minimized.current) {
      return;
    }
    bottomSheetRef.current?.collapse(...args);
  }, []);
  const handleClose = useCallback((...args) => {
    if (minimized.current) {
      return;
    }
    bottomSheetRef.current?.close(...args);
  }, []);
  //#endregion

  //#region bottom sheet modal methods
  const handlePresent = useCallback(
    function handlePresent() {
      requestAnimationFrame(() => {
        if (mount) {
          bottomSheetRef.current?.snapToIndex(index);
          return;
        }
        setMount(true);
        mountSheet(key, ref, stackBehavior);

        print({
          component: BottomSheetModal.name,
          method: handlePresent.name,
        });
      });
    },
    [key, index, stackBehavior, mount, ref, mountSheet]
  );
  const handleDismiss = useCallback(
    function handleDismiss(...args) {
      print({
        component: BottomSheetModal.name,
        method: handleDismiss.name,
        params: {
          currentIndexRef: currentIndexRef.current,
          minimized: minimized.current,
        },
      });
      /**
       * if modal is already been dismiss, we exit the method.
       */
      if (currentIndexRef.current === -1 && minimized.current === false) {
        return;
      }

      if (
        minimized.current ||
        (currentIndexRef.current === -1 && enablePanDownToClose)
      ) {
        unmount();
        return;
      }
      willUnmountSheet(key);
      forcedDismissed.current = true;
      bottomSheetRef.current?.close(...args);
    },
    [willUnmountSheet, unmount, key, enablePanDownToClose]
  );
  const handleMinimize = useCallback(
    function handleMinimize() {
      print({
        component: BottomSheetModal.name,
        method: handleMinimize.name,
        params: {
          minimized: minimized.current,
        },
      });
      if (minimized.current) {
        return;
      }
      minimized.current = true;

      /**
       * if modal got minimized before it finish its mounting
       * animation, we set the `restoreIndexRef` to the
       * provided index.
       */
      if (currentIndexRef.current === -1) {
        restoreIndexRef.current = index;
      } else {
        restoreIndexRef.current = currentIndexRef.current;
      }
      bottomSheetRef.current?.close();
    },
    [index]
  );
  const handleRestore = useCallback(function handleRestore() {
    print({
      component: BottomSheetModal.name,
      method: handleRestore.name,
      params: {
        minimized: minimized.current,
        forcedDismissed: forcedDismissed.current,
      },
    });
    if (!minimized.current || forcedDismissed.current) {
      return;
    }
    minimized.current = false;
    bottomSheetRef.current?.snapToIndex(restoreIndexRef.current);
  }, []);
  //#endregion

  //#region callbacks
  const handlePortalOnUnmount = useCallback(
    function handlePortalOnUnmount() {
      print({
        component: BottomSheetModal.name,
        method: handlePortalOnUnmount.name,
        params: {
          minimized: minimized.current,
          forcedDismissed: forcedDismissed.current,
        },
      });
      /**
       * if modal is already been dismiss, we exit the method.
       */
      if (currentIndexRef.current === -1 && minimized.current === false) {
        return;
      }

      mounted.current = false;
      forcedDismissed.current = true;

      if (minimized.current) {
        unmount();
        return;
      }
      willUnmountSheet(key);
      bottomSheetRef.current?.close();
    },
    [key, unmount, willUnmountSheet]
  );
  const handleBottomSheetOnChange = useCallback(
    function handleBottomSheetOnChange(_index: number) {
      print({
        component: BottomSheetModal.name,
        method: handleBottomSheetOnChange.name,
        params: {
          minimized: minimized.current,
          forcedDismissed: forcedDismissed.current,
        },
      });
      currentIndexRef.current = _index;

      if (_providedOnChange) {
        _providedOnChange(_index);
      }

      if (minimized.current) {
        return;
      }

      if (_index === -1 && enableDismissOnClose) {
        unmount();
      }
    },
    [enableDismissOnClose, unmount, _providedOnChange]
  );
  //#endregion

  //#region expose methods
  useImperativeHandle(ref, () => ({
    // sheet
    snapToIndex: handleSnapToIndex,
    snapToPosition: handleSnapToPosition,
    expand: handleExpand,
    collapse: handleCollapse,
    close: handleClose,
    dismiss: handleDismiss,
    // modal methods
    present: handlePresent,
    // internal
    minimize: handleMinimize,
    restore: handleRestore,
  }));
  //#endregion

  // render
  // console.log('BottomSheetModal', index, snapPoints)
  return mount ? (
    <Portal key={key} name={key} handleOnUnmount={handlePortalOnUnmount}>
      <BottomSheet
        {...bottomSheetProps}
        ref={bottomSheetRef}
        key={key}
        index={index}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        animateOnMount={true}
        containerHeight={containerHeight}
        containerOffset={containerOffset}
        onChange={handleBottomSheetOnChange}
        children={children}
        $modal={true}
      />
    </Portal>
  ) : null;
});

const BottomSheetModal = memo(BottomSheetModalComponent);
BottomSheetModal.displayName = 'BottomSheetModal';

export default BottomSheetModal;
