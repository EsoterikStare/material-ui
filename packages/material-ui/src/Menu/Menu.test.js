
/* eslint-disable no-console */
import * as React from 'react';
import { spy, useFakeTimers } from 'sinon';
import { assert } from 'chai';
import { createMount, getClasses } from '@material-ui/core/test-utils';
import describeConformance from '../test-utils/describeConformance';
import Button from '../Button';
import Popover from '../Popover';
import Menu from './Menu';
import MenuItem from '../MenuItem';
import MenuList from '../MenuList';
import consoleErrorMock from 'test/utils/consoleErrorMock';
import PropTypes from 'prop-types';

const MENU_LIST_HEIGHT = 100;

describe('<Menu />', () => {
  let classes;
  let mount;

  const defaultProps = {
    open: false,
    anchorEl: () => document.createElement('div'),
  };

  before(() => {
    classes = getClasses(<Menu {...defaultProps} />);
    // StrictModeViolation: uses Popover
    mount = createMount({ strict: false });
  });

  after(() => {
    mount.cleanUp();
  });

  describeConformance(<Menu {...defaultProps} open />, () => ({
    classes,
    inheritComponent: Popover,
    mount,
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      // react-transition-group issue
      'reactTestRenderer',
    ],
  }));

  describe('event callbacks', () => {
    describe('entering', () => {
      it('should fire callbacks', (done) => {
        const handleEnter = spy();
        const handleEntering = spy();

        const wrapper = mount(
          <Menu
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={() => {
              assert.strictEqual(handleEnter.callCount, 1);
              assert.strictEqual(handleEnter.args[0].length, 2);
              assert.strictEqual(handleEntering.callCount, 1);
              assert.strictEqual(handleEntering.args[0].length, 2);
              done();
            }}
            {...defaultProps}
          />,
        );

        wrapper.setProps({
          open: true,
        });
      });
    });

    describe('exiting', () => {
      it('should fire callbacks', (done) => {
        const handleExit = spy();
        const handleExiting = spy();

        const wrapper = mount(
          <Menu
            onExit={handleExit}
            onExiting={handleExiting}
            onExited={() => {
              assert.strictEqual(handleExit.callCount, 1);
              assert.strictEqual(handleExit.args[0].length, 1);
              assert.strictEqual(handleExiting.callCount, 1);
              assert.strictEqual(handleExiting.args[0].length, 1);
              done();
            }}
            {...defaultProps}
            open
          />,
        );

        wrapper.setProps({
          open: false,
        });
      });
    });
  });

  it('should pass `classes.paper` to the Popover', () => {
    const wrapper = mount(<Menu {...defaultProps} />);
    assert.strictEqual(wrapper.find(Popover).props().PaperProps.classes.root, classes.paper);
  });

  describe('prop: PopoverClasses', () => {
    it('should be able to change the Popover style', () => {
      const wrapper = mount(<Menu {...defaultProps} PopoverClasses={{ paper: 'bar' }} />);
      assert.strictEqual(wrapper.find(Popover).props().classes.paper, 'bar');
    });
  });

  it('should pass the instance function `getContentAnchorEl` to Popover', () => {
    const menuRef = React.createRef();
    const wrapper = mount(<Menu ref={menuRef} {...defaultProps} />);
    assert.strictEqual(wrapper.find(Popover).props().getContentAnchorEl != null, true);
  });

  // it('should pass onClose prop to Popover', () => {
  //   const fn = () => {};
  //   const wrapper = mount(<Menu {...defaultProps} onClose={fn} />);
  //   assert.strictEqual(wrapper.find(Popover).props().onClose, fn);
  // });

  it('should pass anchorEl prop to Popover', () => {
    const el = document.createElement('div');
    const wrapper = mount(<Menu {...defaultProps} anchorEl={el} />);
    assert.strictEqual(wrapper.find(Popover).props().anchorEl, el);
  });

  it('should pass through the `open` prop to Popover', () => {
    const wrapper = mount(<Menu {...defaultProps} />);
    assert.strictEqual(wrapper.find(Popover).props().open, false);
    wrapper.setProps({ open: true });
    assert.strictEqual(wrapper.find(Popover).props().open, true);
  });

  describe('list node', () => {
    let wrapper;

    before(() => {
      wrapper = mount(<Menu {...defaultProps} className="test-class" data-test="hi" open />);
    });

    it('should render a MenuList inside the Popover', () => {
      assert.strictEqual(wrapper.find(Popover).find(MenuList).exists(), true);
    });
  });

  it('should open during the initial mount', () => {
    const wrapper = mount(
      <Menu {...defaultProps} open>
        <div role="menuitem" tabIndex={-1}>
          one
        </div>
      </Menu>,
    );

    const popover = wrapper.find(Popover);
    assert.strictEqual(popover.props().open, true);
    assert.strictEqual(wrapper.find('[role="menuitem"]').props().autoFocus, true);
  });

  it('should not focus list if autoFocus=false', () => {
    const wrapper = mount(
      <Menu {...defaultProps} autoFocus={false} open>
        <div tabIndex={-1} />
      </Menu>,
    );
    const popover = wrapper.find(Popover);
    assert.strictEqual(popover.props().open, true);
    const menuEl = document.querySelector('[data-mui-test="Menu"]');
    assert.notStrictEqual(document.activeElement, menuEl);
    assert.strictEqual(false, menuEl.contains(document.activeElement));
  });

  it('should call props.onEntering with element if exists', () => {
    const onEnteringSpy = spy();
    const wrapper = mount(<Menu {...defaultProps} onEntering={onEnteringSpy} />);
    const popover = wrapper.find(Popover);

    const elementForHandleEnter = { clientHeight: MENU_LIST_HEIGHT };

    popover.props().onEntering(elementForHandleEnter);
    assert.strictEqual(onEnteringSpy.callCount, 1);
    assert.strictEqual(onEnteringSpy.calledWith(elementForHandleEnter), true);
  });

  it('should call props.onEntering, disableAutoFocusItem', () => {
    const onEnteringSpy = spy();
    const wrapper = mount(
      <Menu disableAutoFocusItem {...defaultProps} onEntering={onEnteringSpy} />,
    );
    const popover = wrapper.find(Popover);

    const elementForHandleEnter = { clientHeight: MENU_LIST_HEIGHT };

    popover.props().onEntering(elementForHandleEnter);
    assert.strictEqual(onEnteringSpy.callCount, 1);
    assert.strictEqual(onEnteringSpy.calledWith(elementForHandleEnter), true);
  });

  it('should call onClose on tab', () => {
    const onCloseSpy = spy();
    const wrapper = mount(
      <Menu {...defaultProps} open onClose={onCloseSpy}>
        <span>hello</span>
      </Menu>,
    );
    wrapper.find('span').simulate('keyDown', {
      key: 'Tab',
    });
    assert.strictEqual(onCloseSpy.callCount, 1);
    assert.strictEqual(onCloseSpy.args[0][1], 'tabKeyDown');
  });

  it('ignores invalid children', () => {
    const wrapper = mount(
      <Menu {...defaultProps} open>
        {null}
        <span role="menuitem">hello</span>
        {/* testing conditional rendering */}
        {false && <span role="menuitem">hello</span>}
        {undefined}
        foo
      </Menu>,
    );

    assert.lengthOf(wrapper.find('span[role="menuitem"]'), 1);
  });

  describe('cascading menu', () => {
    let clock;
    before(() => {
      clock = useFakeTimers();
    });
  
    after(() => {
      clock.restore();
    });

    const NestedMenu = (props) => {
      const [anchorEl, setAnchorEl] = React.useState(null);

      const handleButtonClick = event => {
        setAnchorEl(event.currentTarget);
      };

      const handleItemClick = () => {
        setAnchorEl(null);
      };

      return (
        <div>
          <Button onClick={handleButtonClick}>
            Open Menu
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleItemClick}
            transitionDuration={0}
            {...props}
          >
            <MenuItem id="settings-item" subMenu={<Menu>
              <MenuItem id="dark-mode" onClick={handleItemClick}>Dark Mode</MenuItem>
              <MenuItem id="go-deeper-1" subMenu={<Menu>
                <MenuItem key="deeper2" id="go-deeper-2">Go deeper</MenuItem>
              </Menu>}>Go deeper</MenuItem>
            </Menu>}>Settings</MenuItem>
            <MenuItem id="account-item" subMenu={<Menu>
              <MenuItem id="reset-password" onClick={handleItemClick}>Reset password</MenuItem>
              <MenuItem id="change-username" onClick={handleItemClick}>Change username</MenuItem>
            </Menu>}>My account</MenuItem>
          </Menu>
        </div>
      );
    }
    
    it('displays a nested menu level 1', () => {
      const wrapper = mount(<NestedMenu />);
      wrapper.find(Button).simulate('click');
      wrapper.find("#settings-item").last().simulate('mousemove');

      clock.tick(0);
      wrapper.update();

      const expected = true;
      const actual = wrapper.find('#dark-mode').exists();
      assert.strictEqual(actual, expected);
    });

    it('displays a nested menu level 2', () => {
      const wrapper = mount(<NestedMenu />);
      wrapper.find(Button).simulate('click');
      wrapper.find("#settings-item").last().simulate('mousemove');

      clock.tick(0);
      wrapper.update();

      wrapper.find("#go-deeper-1").last().simulate('mousemove');

      clock.tick(1);
      wrapper.update();

      const expected = true;
      const actual = wrapper.find('#go-deeper-2').exists();
      assert.strictEqual(actual, expected);
    });

    it('nested menus collapse when parent menu is changed', () => {
      const wrapper = mount(<NestedMenu />);
      wrapper.find(Button).simulate('click');
      wrapper.find("#settings-item").last().simulate('mousemove');

      clock.tick(0);
      wrapper.update();

      wrapper.find("#account-item").last().simulate('mousemove');

      clock.tick(0);
      wrapper.update();

      assert.strictEqual(wrapper.find('#change-username').exists(), true);
      wrapper.find("#settings-item").last().simulate('mousemove');

      clock.tick(0);
      wrapper.update();

      assert.strictEqual(wrapper.find('#change-username').exists(), false);
    });

    it('nested menu stays open when mouse is outside of menu', () => {
      const wrapper = mount(<NestedMenu />);
      wrapper.find(Button).simulate('click');
      wrapper.find("#settings-item").last().simulate('mousemove');

      clock.tick(0);
      wrapper.update();

      assert.strictEqual(wrapper.find('#dark-mode').exists(), true);

      wrapper.find("#dark-mode").last().simulate('mousemove');
      wrapper.find("#dark-mode").last().simulate('mouseout');
      wrapper.find(Button).simulate('mouseenter');

      assert.strictEqual(wrapper.find("#dark-mode").last().exists(), true);
    })

    it('opens a nested Menu on RightArrow keydown', () => {
      const wrapper = mount(<NestedMenu />);
      wrapper.find(Button).simulate('click');

      clock.tick(200);
      wrapper.update();

      wrapper.find("#settings-item").last().simulate('keyDown', {
        key: 'ArrowRight'
      });

      clock.tick(200);
      wrapper.update();

      const expected = true;
      const actual = wrapper.find('#dark-mode').exists();
      assert.strictEqual(actual, expected);
    });

    it('closes current nested Menu on LeftArrow keydown', () => {
      const wrapper = mount(<NestedMenu />);
      wrapper.find(Button).simulate('click');

      clock.tick(0);
      wrapper.update();

      wrapper.find("#settings-item").last().simulate('keyDown', {
        key: 'ArrowRight'
      });

      clock.tick(0);
      wrapper.update();

      assert.strictEqual(wrapper.find('#dark-mode').exists(), true);

      wrapper.find("#dark-mode").last().simulate('keyDown', {
        key: 'ArrowLeft'
      });

      clock.tick(0);
      wrapper.update();

      assert.strictEqual(wrapper.find('#dark-mode').exists(), false);
    });

    // it('closes all menus on Tab keydown', () => {
    //   const wrapper = mount(<NestedMenu />);
    //   wrapper.find(Button).simulate('click');

    //   clock.tick(0);
    //   wrapper.update();

    //   wrapper.find("#settings-item").last().simulate('keyDown', {
    //     key: 'ArrowRight'
    //   });

    //   clock.tick(0);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#dark-mode').exists(), true);

    //   wrapper.find("#dark-mode").last().simulate('keyDown', {
    //     key: 'Tab'
    //   });

    //   clock.tick(0);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#settings-item').exists(), false);
    //   assert.strictEqual(wrapper.find('#dark-mode').exists(), false);
    // });

    // it('closes all menus on Escape keydown', () => {
    //   const wrapper = mount(<NestedMenu />);
    //   wrapper.find(Button).simulate('click');

    //   clock.tick(0);
    //   wrapper.update();

    //   wrapper.find("#settings-item").last().simulate('keyDown', {
    //     key: 'ArrowRight'
    //   });

    //   clock.tick(0);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#dark-mode').exists(), true);

    //   wrapper.find("#dark-mode").last().simulate('keyDown', {
    //     key: 'Escape'
    //   });

    //   clock.tick(0);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#settings-item').exists(), false);
    //   assert.strictEqual(wrapper.find('#dark-mode').exists(), false);
    // });

    // it('changes focus with up and down arrow buttons', () => {

    //   const wrapper = mount(<NestedMenu />);
    //   wrapper.find(Button).simulate('click');

    //   clock.tick(0);
    //   wrapper.update();

    //   wrapper.find("#settings-item").last().simulate('keyDown', {
    //     key: 'ArrowRight'
    //   });

    //   clock.tick(0);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#dark-mode').last().hasClass("Mui-focusVisible"), true);

    //   wrapper.find("#dark-mode").last().simulate('keyDown', {
    //     key: 'ArrowDown'
    //   });
    //   assert.strictEqual(wrapper.find('#dark-mode').last().hasClass("Mui-focusVisible"), false);

    //   wrapper.find("#dark-mode").last().simulate('keyDown', {
    //     key: 'ArrowUp'
    //   });
    //   assert.strictEqual(wrapper.find('#dark-mode').last().hasClass("Mui-focusVisible"), true);
    // });

    // it('changes focus with left and right arrow buttons', () => {

    //   const wrapper = mount(<NestedMenu />);
    //   wrapper.find(Button).simulate('click');

    //   clock.tick(0);
    //   wrapper.update();

    //   wrapper.find("#settings-item").last().simulate('keyDown', {
    //     key: 'ArrowRight'
    //   });

    //   clock.tick(0);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#dark-mode').last().hasClass("Mui-focusVisible"), true);

    //   wrapper.find("#dark-mode").last().simulate('keyDown', {
    //     key: 'ArrowLeft'
    //   });
    //   assert.strictEqual(wrapper.find('#settings-item').last().hasClass("Mui-focusVisible"), true);

    //   wrapper.find("#settings-item").last().simulate('keyDown', {
    //     key: 'ArrowRight'
    //   });

    //   assert.strictEqual(wrapper.find('#dark-mode').last().hasClass("Mui-focusVisible"), true);
    // });
  });

  describe('warnings', () => {
    before(() => {
      consoleErrorMock.spy();
    });

    after(() => {
      consoleErrorMock.reset();
      PropTypes.resetWarningCache();
    });

    it('warns a Fragment is passed as a child', () => {
      mount(
        <Menu anchorEl={document.createElement('div')} open>
          <React.Fragment />
        </Menu>,
      );

      assert.strictEqual(consoleErrorMock.callCount(), 2);
      assert.include(
        consoleErrorMock.messages()[0],
        "Material-UI: the Menu component doesn't accept a Fragment as a child.",
      );
    });
  });
});
