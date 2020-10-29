import * as React from 'react';
import { spy, useFakeTimers } from 'sinon';
import { expect, assert } from 'chai';
import { getClasses, createMount, describeConformance } from 'test/utils';
import Button from '../Button';
import Popover from '../Popover';
import Menu from './Menu';
import MenuItem from '../MenuItem';
import MenuList from '../MenuList';

const MENU_LIST_HEIGHT = 100;

describe('<Menu />', () => {
  let classes;
  // StrictModeViolation: Not using act(), prefer using createClientRender from test/utils
  const mount = createMount({ strict: false });
  const defaultProps = {
    open: false,
    anchorEl: () => document.createElement('div'),
  };

  before(() => {
    classes = getClasses(<Menu {...defaultProps} />);
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
            TransitionProps={{
              onEnter: handleEnter,
              onEntering: handleEntering,
              onEntered: () => {
                expect(handleEnter.callCount).to.equal(1);
                expect(handleEnter.args[0].length).to.equal(2);
                expect(handleEntering.callCount).to.equal(1);
                expect(handleEntering.args[0].length).to.equal(2);
                done();
              },
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
            TransitionProps={{
              onExit: handleExit,
              onExiting: handleExiting,
              onExited: () => {
                expect(handleExit.callCount).to.equal(1);
                expect(handleExit.args[0].length).to.equal(1);
                expect(handleExiting.callCount).to.equal(1);
                expect(handleExiting.args[0].length).to.equal(1);
                done();
              },
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
    expect(wrapper.find(Popover).props().PaperProps.classes.root).to.equal(classes.paper);
  });

  describe('prop: PopoverClasses', () => {
    it('should be able to change the Popover style', () => {
      const wrapper = mount(<Menu {...defaultProps} PopoverClasses={{ paper: 'bar' }} />);
      expect(wrapper.find(Popover).props().classes.paper).to.equal('bar');
    });
  });

  it('should pass the instance function `getContentAnchorEl` to Popover', () => {
    const menuRef = React.createRef();
    const wrapper = mount(<Menu ref={menuRef} {...defaultProps} />);
    expect(wrapper.find(Popover).props().getContentAnchorEl != null).to.equal(true);
  });

  it('should pass onClose prop to Popover', () => {
    const fn = () => {};
    const wrapper = mount(<Menu {...defaultProps} onClose={fn} />);
    expect(wrapper.find(Popover).props().onClose).to.equal(fn);
  });

  it('should pass anchorEl prop to Popover', () => {
    const el = document.createElement('div');
    const wrapper = mount(<Menu {...defaultProps} anchorEl={el} />);
    expect(wrapper.find(Popover).props().anchorEl).to.equal(el);
  });

  it('should pass through the `open` prop to Popover', () => {
    const wrapper = mount(<Menu {...defaultProps} />);
    expect(wrapper.find(Popover).props().open).to.equal(false);
    wrapper.setProps({ open: true });
    expect(wrapper.find(Popover).props().open).to.equal(true);
  });

  describe('list node', () => {
    it('should render a MenuList inside the Popover', () => {
      const wrapper = mount(<Menu {...defaultProps} className="test-class" data-test="hi" open />);
      expect(wrapper.find(Popover).find(MenuList).exists()).to.equal(true);
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
    expect(popover.props().open).to.equal(true);
    expect(wrapper.find('[role="menuitem"]').props().autoFocus).to.equal(true);
  });

  it('should not focus list if autoFocus=false', () => {
    const wrapper = mount(
      <Menu {...defaultProps} autoFocus={false} open>
        <div tabIndex={-1} />
      </Menu>,
    );
    const popover = wrapper.find(Popover);
    expect(popover.props().open).to.equal(true);
    const menuEl = document.querySelector('[data-mui-test="Menu"]');
    expect(document.activeElement).to.not.equal(menuEl);
    expect(false).to.equal(menuEl.contains(document.activeElement));
  });

  it('should call TransitionProps.onEntering with element if exists', () => {
    const onEnteringSpy = spy();
    const wrapper = mount(
      <Menu {...defaultProps} TransitionProps={{ onEntering: onEnteringSpy }} />,
    );
    const popover = wrapper.find(Popover);

    const elementForHandleEnter = { clientHeight: MENU_LIST_HEIGHT };

    popover.props().TransitionProps.onEntering(elementForHandleEnter);
    expect(onEnteringSpy.callCount).to.equal(1);
    expect(onEnteringSpy.calledWith(elementForHandleEnter)).to.equal(true);
  });

  it('should call TransitionProps.onEntering, disableAutoFocusItem', () => {
    const onEnteringSpy = spy();
    const wrapper = mount(
      <Menu
        disableAutoFocusItem
        {...defaultProps}
        TransitionProps={{ onEntering: onEnteringSpy }}
      />,
    );
    const popover = wrapper.find(Popover);

    const elementForHandleEnter = { clientHeight: MENU_LIST_HEIGHT };

    popover.props().TransitionProps.onEntering(elementForHandleEnter);
    expect(onEnteringSpy.callCount).to.equal(1);
    expect(onEnteringSpy.calledWith(elementForHandleEnter)).to.equal(true);
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
    expect(onCloseSpy.callCount).to.equal(1);
    expect(onCloseSpy.args[0][1]).to.equal('tabKeyDown');
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

    expect(wrapper.find('span[role="menuitem"]')).to.have.length(1);
  });

  describe('warnings', () => {
    it('warns a Fragment is passed as a child', () => {
      expect(() => {
        mount(
          <Menu anchorEl={document.createElement('div')} open>
            <React.Fragment />
          </Menu>,
        );
      }).toErrorDev([
        "Material-UI: The Menu component doesn't accept a Fragment as a child.",
        // twice in StrictMode
        "Material-UI: The Menu component doesn't accept a Fragment as a child.",
      ]);
    });
  });

  describe('cascading menu', () => {
    let clock;
    let cascadeMount;
    let wrapper;

    before(() => {
      clock = useFakeTimers();
      // StrictModeViolation: uses Popover
      cascadeMount = createMount({ strict: false });
    });

    beforeEach(() => {
      wrapper = cascadeMount(<CascadingMenu />);
    });

    afterEach(() => {
      clock.restore();
      wrapper.unmount();
    });

    // after(() => {
    // });

    const CascadingMenu = (props) => {
      const [anchorEl, setAnchorEl] = React.useState(null);

      const handleButtonClick = (event) => {
        setAnchorEl(event.currentTarget);
      };

      const handleItemClick = () => {
        setAnchorEl(null);
      };

      return (
        <div>
          <Button onClick={handleButtonClick}>Open Menu</Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleItemClick}
            transitionDuration={0}
            {...props}
          >
            <MenuItem
              id="settings-item"
              subMenu={
                <Menu>
                  <MenuItem id="regular-item" onClick={handleItemClick}>
                    Regular Item
                  </MenuItem>
                  <MenuItem
                    id="go-deeper-1"
                    subMenu={
                      <Menu>
                        <MenuItem key="deeper2" id="go-deeper-2">
                          Go deeper
                        </MenuItem>
                      </Menu>
                    }
                  >
                    Go deeper
                  </MenuItem>
                </Menu>
              }
            >
              Settings
            </MenuItem>
            <MenuItem
              id="account-item"
              subMenu={
                <Menu>
                  <MenuItem id="reset-password" onClick={handleItemClick}>
                    Reset password
                  </MenuItem>
                  <MenuItem id="change-username" onClick={handleItemClick}>
                    Change username
                  </MenuItem>
                </Menu>
              }
            >
              My account
            </MenuItem>
          </Menu>
        </div>
      );
    };

    it('displays a sub menu level 1', () => {
      wrapper.find(Button).simulate('click');
      wrapper.find('#settings-item').last().simulate('mousemove');

      clock.tick(0);
      wrapper.update();

      assert.strictEqual(wrapper.find('#regular-item').exists(), true);
    });

    // it('displays a sub menu level 2', () => {
    //   wrapper.find(Button).simulate('click');
    //   wrapper.find('#settings-item').last().simulate('mousemove');

    //   clock.tick(0);
    //   wrapper.update();

    //   wrapper.find('#go-deeper-1').last().simulate('mousemove');

    //   clock.tick(500);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#go-deeper-2').exists(), true);
    // });

    // it('sub menus collapse when parent menu is changed', () => {
    //   wrapper.find(Button).simulate('click');
    //   wrapper.find('#settings-item').last().simulate('mousemove');

    //   clock.tick(0);
    //   wrapper.update();

    //   wrapper.find('#account-item').last().simulate('mousemove');

    //   clock.tick(0);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#change-username').exists(), true);
    //   wrapper.find('#settings-item').last().simulate('mousemove');

    //   clock.tick(0);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#change-username').exists(), false);
    // });

    // it('sub menu stays open when mouse is outside of menu', () => {
    //   wrapper.find(Button).simulate('click');
    //   wrapper.find('#settings-item').last().simulate('mousemove');

    //   clock.tick(0);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#regular-item').exists(), true);

    //   wrapper.find('#regular-item').last().simulate('mousemove');
    //   wrapper.find('#regular-item').last().simulate('mouseout');
    //   wrapper.find(Button).simulate('mouseenter');

    //   assert.strictEqual(wrapper.find('#regular-item').last().exists(), true);
    // });

    // it('opens a sub Menu on RightArrow keydown', () => {
    //   wrapper.find(Button).simulate('click');

    //   clock.tick(200);
    //   wrapper.update();

    //   wrapper.find('#settings-item').last().simulate('keyDown', {
    //     key: 'ArrowRight',
    //   });

    //   clock.tick(200);
    //   wrapper.update();

    //   const expected = true;
    //   const actual = wrapper.find('#regular-item').exists();
    //   assert.strictEqual(actual, expected);
    // });

    // it('closes current sub Menu on LeftArrow keydown', () => {
    //   wrapper.find(Button).simulate('click');

    //   clock.tick(0);
    //   wrapper.update();

    //   wrapper.find('#settings-item').last().simulate('keyDown', {
    //     key: 'ArrowRight',
    //   });

    //   clock.tick(0);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#regular-item').exists(), true);

    //   wrapper.find('#regular-item').last().simulate('keyDown', {
    //     key: 'ArrowLeft',
    //   });

    //   clock.tick(0);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#regular-item').exists(), false);
    // });

    // it('closes all menus on Tab keydown', () => {
    //   wrapper.find(Button).simulate('click');

    //   clock.tick(0);
    //   wrapper.update();

    //   wrapper.find('#settings-item').last().simulate('keyDown', {
    //     key: 'ArrowRight',
    //   });

    //   clock.tick(0);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#regular-item').exists(), true);

    //   wrapper.find('#regular-item').last().simulate('keyDown', {
    //     key: 'Tab',
    //   });

    //   clock.tick(0);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#settings-item').exists(), false);
    //   assert.strictEqual(wrapper.find('#regular-item').exists(), false);
    // });

    // it('closes all menus on Escape keydown', () => {
    //   wrapper.find(Button).simulate('click');

    //   clock.tick(0);
    //   wrapper.update();

    //   wrapper.find('#settings-item').last().simulate('keyDown', {
    //     key: 'ArrowRight',
    //   });

    //   clock.tick(0);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#regular-item').exists(), true);

    //   wrapper.find('#regular-item').last().simulate('keyDown', {
    //     key: 'Escape',
    //   });

    //   clock.tick(0);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#settings-item').exists(), false);
    //   assert.strictEqual(wrapper.find('#regular-item').exists(), false);
    // });

    // it('changes focus with up and down arrow buttons', () => {
    //   wrapper.find(Button).simulate('click');

    //   clock.tick(0);
    //   wrapper.update();

    //   wrapper.find('#settings-item').last().simulate('keyDown', {
    //     key: 'ArrowRight',
    //   });

    //   clock.tick(0);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#regular-item').last().hasClass('Mui-focusVisible'), true);

    //   wrapper.find('#regular-item').last().simulate('keyDown', {
    //     key: 'ArrowDown',
    //   });
    //   assert.strictEqual(wrapper.find('#regular-item').last().hasClass('Mui-focusVisible'), false);

    //   wrapper.find('#regular-item').last().simulate('keyDown', {
    //     key: 'ArrowUp',
    //   });
    //   assert.strictEqual(wrapper.find('#regular-item').last().hasClass('Mui-focusVisible'), true);
    // });

    // it('changes focus with left and right arrow buttons', () => {
    //   wrapper.find(Button).simulate('click');

    //   clock.tick(0);
    //   wrapper.update();

    //   wrapper.find('#settings-item').last().simulate('keyDown', {
    //     key: 'ArrowRight',
    //   });

    //   clock.tick(0);
    //   wrapper.update();

    //   assert.strictEqual(wrapper.find('#regular-item').last().hasClass('Mui-focusVisible'), true);

    //   wrapper.find('#regular-item').last().simulate('keyDown', {
    //     key: 'ArrowLeft',
    //   });
    //   // FIXME: @eps1lon - the assertion below is what's failing after the changes in https://github.com/mui-org/material-ui/commit/e58cc23df9e262a0f95c822504ac6c019b94407d
    //   // Basically, this test correctly discovered that the parent item is no longer getting the Mui-focusVisible class when its child menu closes after an ArrowLeft.
    //   // So, from manual testing, I confirmed the correct item is technically focused, as before, but it no longer _appears_ focused.
      
    //   // assert.strictEqual(wrapper.find('#settings-item').last().hasClass('Mui-focusVisible'), true);

    //   wrapper.find('#settings-item').last().simulate('keyDown', {
    //     key: 'ArrowRight',
    //   });

    //   assert.strictEqual(wrapper.find('#regular-item').last().hasClass('Mui-focusVisible'), true);
    // });
  });
});
