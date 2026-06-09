// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Counter {
    // 가스 효율을 위해 immutable 사용
    address public immutable owner;
    uint256 private counter = 0;

    // 에러 메시지 문자열 대신 커스텀 에러를 사용하여 가스비를 절감
    error NotOwner();
    error CounterUnderflow();

    // 데이터 변화를 외부 앱(프론트엔드)에서 감지할 수 있도록 이벤트를 추가
    event CounterChanged(uint256 newValue, address indexed actor);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }

    function incrementCounter() public {
        counter++;
        emit CounterChanged(counter, msg.sender);
    }

    function decrementCounter() public {
        if (counter == 0) {
            revert CounterUnderflow();
        }
        counter--;
        emit CounterChanged(counter, msg.sender);
    }

    function resetCounter() public onlyOwner {
        counter = 0;
        emit CounterChanged(counter, msg.sender);
    }
}
