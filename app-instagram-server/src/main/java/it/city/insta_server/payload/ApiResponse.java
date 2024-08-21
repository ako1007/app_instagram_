package it.city.insta_server.payload;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter

public class ApiResponse {

    private String message;
    private boolean success;

    private Object object;

    public ApiResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }

    public ApiResponse(boolean success, Object object) {
        this.success = success;
        this.object = object;
    }
}
