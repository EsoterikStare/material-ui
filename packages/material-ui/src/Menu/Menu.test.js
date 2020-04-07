import * as React from 'react';
import { spy } from 'sinon';
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

  const NestedMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleButtonClick = event => {
      setAnchorEl(event.currentTarget);
    };

    const handleItemClick = () => {
      setAnchorEl(null);
    };

    const deeper3 = [
      <MenuItem id="you-did-it" onClick={handleItemClick}>You did it!</MenuItem>,
      <MenuItem onClick={handleItemClick}>You did it!</MenuItem>,
      <MenuItem onClick={handleItemClick}>You did it!</MenuItem>
    ];

    const deeper2 = [
      <MenuItem onClick={handleItemClick}>Not this one</MenuItem>,
      <MenuItem onClick={handleItemClick}>Not this one</MenuItem>,
      <MenuItem onClick={handleItemClick}>Not this one</MenuItem>,
      <MenuItem id="go-deeper-3" nestedItems={deeper3}>Go deeper</MenuItem>,
      <MenuItem onClick={handleItemClick}>Not this one</MenuItem>,
      <MenuItem onClick={handleItemClick}>Not this one</MenuItem>
    ];

    const deeper1= [
      <MenuItem id="go-deeper-2" nestedItems={deeper2}>Go deeper</MenuItem>,
      <MenuItem onClick={handleItemClick}>Not this one</MenuItem>,
      <MenuItem onClick={handleItemClick}>Not this one</MenuItem>
    ];

    const autoSaveItems = [
      <MenuItem onClick={handleItemClick}>On Exit</MenuItem>,
      <MenuItem id="on-change" onClick={handleItemClick}>On Change</MenuItem>,
    ];

    const settingItems = [
      <MenuItem id="dark-mode" onClick={handleItemClick}>Dark Mode</MenuItem>,
      <MenuItem onClick={handleItemClick}>Verbos Logging</MenuItem>,
      <MenuItem nestedItems={autoSaveItems}>Auto-save</MenuItem>,
      <MenuItem id="go-deeper-1" nestedItems={deeper1}>Go deeper</MenuItem>
    ];

    const myAccountItems = [
      <MenuItem onClick={handleItemClick}>Reset password</MenuItem>,
      <MenuItem id="change-username" onClick={handleItemClick}>Change username</MenuItem>,
    ];

    const mainMenuItems = [
      <MenuItem nestedItems={settingItems}>Settings</MenuItem>,
      <MenuItem nestedItems={myAccountItems}>My account</MenuItem>,
      <MenuItem id="logout" onClick={handleItemClick}>Logout</MenuItem>,
      <MenuItem onClick={handleItemClick}>Thing</MenuItem>,
      <MenuItem onClick={handleItemClick}>Other thing</MenuItem>
    ];

    return (
      <div>
        <Button aria-controls="simple-menu" aria-haspopup="true" data-test="open-menu" onClick={handleButtonClick}>
          Open Menu
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleItemClick}
          variant="selectedMenu"
        >
          {mainMenuItems}
        </Menu>
      </div>
    );
  }
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

    it('displays a nested menu', () => {
      const wrapper = mount(<NestedMenu />);
      wrapper.find(Button).simulate('click');
      wrapper.find(MenuItem).at(0).simulate('mouseenter');

      const expected = true;
      const actual = wrapper.find('#dark-mode').exists();

      assert.strictEqual(actual, expected);
    });

    it('displays nested submenus', () => {
      const wrapper = mount(<NestedMenu />);
      wrapper.find(Button).simulate('click');
      wrapper.find(MenuItem).at(0).simulate('mouseenter');
      wrapper.find('#go-deeper-1').at(0).simulate('mouseenter');

      const expected = true;
      const actual = wrapper.find('#go-deeper-2').exists();

      assert.strictEqual(actual, expected);
    });

    it('nested menus collapse when parent menu is changed', () => {
      const wrapper = mount(<NestedMenu />);
      wrapper.find(Button).simulate('click');
      wrapper.find(MenuItem).at(1).simulate('mouseenter');

      assert.strictEqual(wrapper.find('#change-username').exists(), true);
      wrapper.find('#logout').at(0).simulate('mouseenter');
      assert.strictEqual(wrapper.find('#change-username').exists(), false);
    });

    it('nested menus stay open when menus are not focused', () => {
      const wrapper = mount(<NestedMenu />);
      wrapper.find(Button).simulate('click');
      wrapper.find(MenuItem).at(1).simulate('mouseenter');

      wrapper.find('[data-test="open-menu"]').hostNodes().simulate('mouseenter');
      assert.strictEqual(wrapper.find('#change-username').exists(), true);
    });

  });
});
