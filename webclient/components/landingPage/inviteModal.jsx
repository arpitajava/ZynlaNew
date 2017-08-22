import React, {PropTypes} from 'react';

class inviteModal extends React.Component {
  static propTypes = {
      onClose: PropTypes.func
  };

  render() {
    if (this.props.isOpen === false)
      {
        return null;
      }
    let modalStyle = {
      position: 'fixed',
      top: '85%',
      left: '90%',
      transform: 'translate(-50%, -50%)',
      zIndex: '9999',
      background: '#fff',
      width: 400,
      height: 400,
      bottom: '10',
      borderWidth: '1',
      borderRadius: '4'
    };

    if (this.props.width && this.props.height) {
      modalStyle.width = this.props.width + 'px';
      modalStyle.height = this.props.height + 'px';
     modalStyle.marginLeft = '-' + (this.props.width / 2) + 'px';
     modalStyle.marginTop = '-' + (this.props.height / 2) + 'px';
      // modalStyle.marginRight = '0px'
      modalStyle.marginBottom = '10px';
      modalStyle.borderWidth = '1px';
      modalStyle.borderRadius = '4px';
      modalStyle.transform = null;
    }

    // if (this.props.style) {
    //   for (let key in this.props.style) {
    //     modalStyle[key] = this.props.style[key]
    //   }
    // }

    let backdropStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: '0px',
      left: '0px',
      zIndex: '9998',
      background: 'rgba(0, 0, 0, 0.3)'
    };

    // if (this.props.backdropStyle) {
    //   for (let key in this.props.backdropStyle) {
    //     backdropStyle[key] = this.props.backdropStyle[key]
    //   }
    // }

    return (
      <div className={this.props.containerClassName}>
        <div className={this.props.className} style={modalStyle}>
          {this.props.children}
        </div>
        {!this.props.noBackdrop &&
            <div className={this.props.backdropClassName} style={backdropStyle}
                 onClick={e => this.close(e)}/>}
      </div>
    );
  }

  close(e) {
    e.preventDefault();

    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}
inviteModal.propTypes = {
	containerClassName: React.PropTypes.string.isRequired,
  className: React.PropTypes.string.isRequired,
  children: React.PropTypes.string.isRequired,
  noBackdrop: React.PropTypes.string.isRequired,
 backdropClassName: React.PropTypes.string.isRequired,
 height: React.PropTypes.number.isRequired,
 width: React.PropTypes.number.isRequired,
 isOpen: React.PropTypes.number.isRequired
};
module.exports = inviteModal;
